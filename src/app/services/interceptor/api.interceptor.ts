import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accToken');
    let authReq = req;

    if (token) {
        authReq = req.clone({
          setHeaders: {
            'X-auth-token': token
          }
        });
<<<<<<< HEAD

=======
      } else {
        authReq = req.clone({
          setHeaders: {
            'X-auth-token': token
          }
        });
      }
>>>>>>> 5ced4070db8b02e61066dc72d4969080a7e87559
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