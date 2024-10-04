import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of, combineLatest, map, firstValueFrom } from 'rxjs';
import urlConfig from 'src/app/config/url.config.json';
import { ApiBaseService } from '../base-api/api-base.service';
import { ToastService } from '../toast/toast.service';
import { LoaderService } from '../loader/loader.service';
import { FETCH_Profile_FORM } from 'src/app/core/constants/formConstant';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { Location } from '@angular/common';
import { FETCH_HOME_FORM } from '../../core/constants/formConstant';
import { ProjectsApiService } from '../projects-api/projects-api.service';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService,
    private router: Router,
    private alertService: AlertService,
    private location: Location,
    private projectsApiService: ProjectsApiService
  ) { }

  getFormJsonAndData(): Observable<any> {
    return combineLatest([
      this.apiBaseService.post(urlConfig['formListing'].listingUrl, FETCH_Profile_FORM).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'FORM_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(urlConfig['profileListing'].listingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'PROFILE_DATA_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
    ]).pipe(finalize(async () => await this.loader.dismissLoading()));
  }

  getProfileAndEntityConfigData() {
    return combineLatest([
      this.apiBaseService.get(urlConfig['project'].entityConfigUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'FORM_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(urlConfig['profileListing'].listingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'PROFILE_DATA_LOAD_ERROR', 'danger');
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
          }
        },(err:any)=>{
          this.toastService.presentToast(err?.error?.message, 'danger');
        }),
        finalize(async () => await this.loader.dismissLoading())
      );
  }

  private fetchEntitieIds(data: any, keys: any) {
    let result: any = {};
    keys.forEach((key: any) => {
      if (key === 'roles' && data.user_roles) {
        result["role"] = data.user_roles.map((role: any) => role.title).join(',');
      } else if (data[key]) {
        if (Array.isArray(data[key])) {
          result[key] = data[key].map((item: any) => item).join(',');
        } else if (data[key].value) {
          result[key] = data[key].value;
        }
      }
    });
    return result;
  }

  async presentAlert() {
    this.alertService.presentAlert(
      'ALERT',
      'PROFILE_UPDATE_MSG',
      [
        {
          text: 'BACK',
          role: 'cancel',
          cssClass: 'secondary-button',
          handler: () => {
            this.location.back()
          }
        },
        {
          text: 'PROFILE_UPDATE',
          cssClass: 'primary-button',
          handler: () => {
            this.router.navigate(['/profile-edit']);
          }
        }
      ]
    );
  }

  async getHomeConfig(listType: any, isReport?: boolean): Promise<any> {
    try {
      const response: any = await firstValueFrom(this.projectsApiService.post(urlConfig['formListing'].listingUrl, FETCH_HOME_FORM));
      if (response.status === 200 && response.result) {
        let data = response.result.data;
        let solutionList = data.find((item: any) => item.type === 'solutionList');
        let returnData:any
        if (solutionList) {
          if(isReport){
            let reportList = solutionList.listingData.find((data: any) => data.listType === "report");
            returnData = reportList.list.find((data: any) => data.listType === listType)
          }else{
            returnData = solutionList.listingData.find((data: any) => data.listType === listType);
          }
          return returnData
        }
      }
      return null
    } catch (error: any) {
      this.toastService.presentToast(error?.error?.message, "danger");
      throw error;
    }
  }
}