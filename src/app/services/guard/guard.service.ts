import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface isDeactivatable {
  canPageLeave: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  
  canDeactivate(
    component: isDeactivatable
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component?.canPageLeave ? component.canPageLeave() : true;
  }
}
