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
    let authReq = req;

    if (token) {
      if (req.url.includes('/logout') || req.url.includes('/user/update') ||
        req.url.includes('/cloud-services/file/getSignedUrl') || req.url.includes('getDownloadableUrl')) {
        authReq = req.clone({
          setHeaders: {
            'X-auth-token': `bearer ${token}`
          }
        });
      }
      else if (req.url.includes('storage.googleapis.com')) {
        authReq = req.clone({
          setHeaders: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      else {
        authReq = req.clone({
          setHeaders: {
            'X-auth-token': token
          }
        });
      }
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.status === 401) {
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }
        return throwError(error);
      })
    );
  }
}