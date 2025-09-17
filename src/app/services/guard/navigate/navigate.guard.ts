import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const navigateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const router = inject(Router);

    if (environment.unauthorizedRedirectUrl) {
        location.href = environment.unauthorizedRedirectUrl;
    } else {
        const url = document.baseURI;
        const modifiedUrl = url.replace(/\/ml\/$/, '/');
        location.href = modifiedUrl;
    }

    return false; 
};

