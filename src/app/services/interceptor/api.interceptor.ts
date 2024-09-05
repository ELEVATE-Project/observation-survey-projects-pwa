import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
      this.router.navigateByUrl('/login');
    }
    return throwError(() => ({
      status: 500,
      error: { message: 'Your session has expired. Please log in again.' },
    }));
  }
}
