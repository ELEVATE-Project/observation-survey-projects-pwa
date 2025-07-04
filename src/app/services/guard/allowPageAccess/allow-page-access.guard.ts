import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const allowPageAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  => {
  const router = inject(Router)
  if(environment.restrictedPages.includes(route.data["pageId"])){
    console.log("this is entering in the allow page access guard");
    // location.href = environment.unauthorizedRedirectUrl
    localStorage.clear();
    let url = document.baseURI;
    let modifiedUrl = url.replace(/\/ml\/$/, '/');
    location.href = modifiedUrl + "?unAuth=true";
    return false
  }
  return true;
};