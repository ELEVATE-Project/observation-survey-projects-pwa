import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, fromEvent, merge } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { UtilService } from '../util/util.service';
@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  private onlineStatus: boolean = true;
  constructor(private router: Router,private toast:ToastService,private utilService:UtilService) {
    const onlineEvent = fromEvent(window, 'online').pipe(map(() => true));
    const offlineEvent = fromEvent(window, 'offline').pipe(map(() => false));
    merge(onlineEvent, offlineEvent).pipe(startWith(navigator.onLine)).subscribe(isOnline => {
      this.onlineStatus = isOnline;
      if (!this.onlineStatus) {
        this.toast.presentToast('You are offline,please connect to a network', 'danger');
      }
    });
   }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.onlineStatus) {
      return this.handleOfflineError();
    }
    const token = localStorage.getItem('accToken');
    let authReq = this.addAuthHeader(req, token);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private addAuthHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    if (!token) {
      return req;
    }

    if (this.isSpecialUrl(req.url)) {
      return req.clone({
        setHeaders: { 'X-auth-token': `bearer ${token}` }
      });
    } else if (req.url.includes('storage.googleapis.com')) {
      return req.clone({
        setHeaders: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      return req.clone({
        setHeaders: { 'X-auth-token': token }
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
      this.router.navigateByUrl('/login');
    }
    return throwError(error);
    }
  private handleOfflineError(): Observable<never> {
        return throwError(() => ({
          status: 0,
          error:{message: 'You are offline,please connect to a network',}
        }));
  }
}
