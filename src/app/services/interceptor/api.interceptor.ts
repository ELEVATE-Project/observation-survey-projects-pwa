import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, fromEvent, merge, from } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { UtilService } from '../util/util.service';
import { ApiWithoutInteceptor } from './api.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  private onlineStatus: boolean = true;
  constructor(private router: Router,private toast:ToastService,private utilService:UtilService,private apiCallWithoutInteceptor:ApiWithoutInteceptor) {
    const onlineEvent = fromEvent(window, 'online').pipe(map(() => true));
    const offlineEvent = fromEvent(window, 'offline').pipe(map(() => false));
    merge(onlineEvent, offlineEvent).pipe(startWith(navigator.onLine)).subscribe(isOnline => {
      this.onlineStatus = isOnline;
      if (!this.onlineStatus) {
        this.toast.presentToast('NETWORK_OFFLINE', 'danger');
      }
    });
   }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.onlineStatus) {
      return this.handleOfflineError();
    }

    return from(this.getToken()).pipe(
      switchMap((token) => {
        const authReq = this.addAuthHeader(req, token);
        return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
        );
      })
    );
  }

  private addAuthHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    if (!token) {
      return req;
    }

    let headers: any = localStorage.getItem('headers');
    let extraHeaders = JSON.parse(headers);

    if (this.isSpecialUrl(req.url)) {
      return req.clone({
        setHeaders: extraHeaders ? { 'X-auth-token': `bearer ${token}`,...extraHeaders } : { 'X-auth-token': `bearer ${token}` }
      });
    } else if (req.headers.has("skipInterceptor")) {
      return req.clone({
        headers: req.headers.delete('skipInterceptor'),
      });
    } else {
        return req.clone({
          setHeaders: extraHeaders ? { 'X-auth-token': token, ...extraHeaders } : { 'X-auth-token': token }
        });
  }
  }

  private isSpecialUrl(url: string): boolean {
    return url.includes('/logout') ||
           url.includes('/user/update') ||
           url.includes('/cloud-services/file/getSignedUrl') ||
           url.includes('getDownloadableUrl');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error?.status === 401) {
      localStorage.clear();
      this.utilService.clearDatabase();
      location.href = environment.unauthorizedRedirectUrl
      return throwError(() => ({
        status: 401,
        error: { message: 'Your session has expired. Please log in again.' },
      }));
    }
    return throwError(error);

    }
  private handleOfflineError(): Observable<any> {
        return throwError(() => ({
          error:{message: 'NETWORK_OFFLINE'}
        }));
  }

  async getToken(): Promise<string | null> {
    let token = localStorage.getItem('accToken');
    if (!token) {
      return null;
    }
    if(environment.isAuthBypassed){
      return token
    }
    const isValidToken = await this.utilService.validateToken(token);
    if (!isValidToken) {
      const data = await this.apiCallWithoutInteceptor.getAccessToken();
      if (data) {
        localStorage.setItem('accToken', data);
        return data;
      }
    }
    return token;
  }
}
