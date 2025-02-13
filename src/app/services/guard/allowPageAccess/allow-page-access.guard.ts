import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const allowPageAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  => {
  const router = inject(Router)
  if(environment.restrictedPages.includes(route.data["pageId"])){
    location.href = environment.unauthorizedRedirectUrl
    return false
  }
  return true;
};