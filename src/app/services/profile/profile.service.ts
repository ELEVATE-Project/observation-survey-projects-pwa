import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of, combineLatest, map } from 'rxjs';
import urlConfig from 'src/app/config/url.config.json';
import { ApiBaseService } from '../base-api/api-base.service';
import { ToastService } from '../toast/toast.service';
import { LoaderService } from '../loader/loader.service';
import { FETCH_Profile_FORM } from 'src/app/core/constants/formConstant';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService,
    private router: Router,
    private alertService: AlertService
  ) { }

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

  getProfileAndEntityConfigData() {
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
    ])
      .pipe(
        map(([entityConfigRes, profileFormDataRes]: any) => {
          if (entityConfigRes?.status === 200 && profileFormDataRes?.status === 200) {
            const profileData = entityConfigRes?.result?.meta?.profileKeys;
            const profileDetails = profileFormDataRes?.result;
            if (profileDetails?.state) {
              return this.fetchEntitieIds(profileDetails, profileData);
            } else {
              this.presentAlert();
            }
          } else {
            this.toastService.presentToast('Failed to load profile data. Please try again later.', 'danger');
            return null;
          }
        }),
        finalize(async () => await this.loader.dismissLoading())
      );
  }

  private fetchEntitieIds(data: any, keys: any) {
    let result: any = {};
    keys.forEach((key: any) => {
      // if (key === 'roles' && data.user_roles) {
      //   result[key] = data.user_roles.map((role: any) => role.title).join(',');
      // } else if (data[key]) {
      //   if (Array.isArray(data[key])) {
      //     result[key] = data[key].map((item: any) => item).join(',');
      //   } else if (data[key].value) {
      //     result[key] = data[key].value;
      //   }
      // }
      result["role"] = data.user_roles.map((role: any) => role.title).join(',');
    });
    return result;
  }

  async presentAlert() {
    this.alertService.presentAlert(
      'Alert',
      'Please update your profile to access the feature.',
      [
        {
          text: 'Back',
          role: 'cancel',
          cssClass: 'secondary-button',
          handler: () => {
            this.router.navigate(['/home']);
          }
        },
        {
          text: 'Update Profile',
          cssClass: 'primary-button',
          handler: () => {
            this.router.navigate(['/profile-edit']);
          }
        }
      ]
    );
  }
}