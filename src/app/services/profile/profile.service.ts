import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of, combineLatest } from 'rxjs';
import urlConfig from 'src/app/config/url.config.json';
import { ApiBaseService } from '../base-api/api-base.service';
import { ToastService } from '../toast/toast.service';
import { LoaderService } from '../loader/loader.service';
import { FETCH_Profile_FORM } from 'src/app/core/constants/formConstant';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService
  ) {}
  
  getFormJsonAndData(): Observable<any> {
    return combineLatest([
      this.apiBaseService.post(urlConfig['formListing'].listingUrl, FETCH_Profile_FORM).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'Error loading form JSON', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(urlConfig['profileListing'].listingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'Error loading profile data', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
    ]).pipe(finalize(async () => await this.loader.dismissLoading()));
  }

    
  getProfileAndEntityConfigData(): Observable<any> {
    return combineLatest([
      this.apiBaseService.get(urlConfig['project'].entityConfigUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'Error loading form JSON', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(urlConfig['profileListing'].listingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'Error loading profile data', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
    ]).pipe(finalize(async () => await this.loader.dismissLoading()));
  }
}
