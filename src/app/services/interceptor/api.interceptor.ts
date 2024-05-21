import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accToken');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          'X-authenticated-user-token': token
        }
      });
    }

    // Pass on the cloned request instead of the original request
    return next.handle(authReq);
  }
}