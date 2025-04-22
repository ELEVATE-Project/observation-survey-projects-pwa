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
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profilePage = environment.profileRedirectPath || '';
  profileListingUrl = (environment.capabilities.includes('all') || environment.capabilities.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['profileListing'].listingUrl;
  formListingUrl = (environment.capabilities.includes('all') || environment.capabilities.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['formListing'].listingUrl;
  entityConfigUrl = (environment.capabilities.includes('all') || environment.capabilities.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['profileListing'].entityConfigUrl;
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
      this.apiBaseService.post(this.formListingUrl, FETCH_Profile_FORM).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'FORM_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(this.profileListingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'PROFILE_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
    ]).pipe(finalize(async () => await this.loader.dismissLoading()));
  }

  getProfileAndEntityConfigData() {
    return combineLatest([
      this.apiBaseService.get(this.entityConfigUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'FORM_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(this.profileListingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'PROFILE_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
    ])
      .pipe(
        map(([entityConfigRes, profileFormDataRes]: any) => {
          let profileData = localStorage.getItem("profileData")
          if(profileData){
            let parsedData = JSON.parse(profileData)
            if(parsedData?.state){
              return parsedData
            }else{
              this.presentAlert();
            }
          }
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
            this.router.navigate([this.profilePage]);
          }
        }
      ]
    );
  }

  async getHomeConfig(listType: any, isReport?: boolean): Promise<any> {
    try {
      // const response: any = await firstValueFrom(this.projectsApiService.post(this.formListingUrl, FETCH_HOME_FORM));
      const response: any = {
        "message": "Form fetched successfully",
        "status": 200,
        "result": {
            "data": [
                {
                    "type": "bannerList",
                    "listingData": [
                        {
                            "title": "Hey, Welcome back!",
                            "discription": ""
                        }
                    ]
                },
                {
                    "type": "solutionList",
                    "listingData": [
                        {
                            "name": "Programs",
                            "description": "View and participate in educational programs active in your location and designed for the role you selected",
                            "img": "assets/images/ic_program.svg",
                            "listType": "program",
                            "redirectionUrl": "/listing/program",
                            "solutionType": "isAPrivateProgram",
                            "reportPage": false
                        },
                        {
                            "name": "Projects",
                            "img": "assets/images/ic_project.svg",
                            "redirectionUrl": "/listing/project",
                            "listType": "project",
                            "solutionType": "improvementProject",
                            "reportPage": false,
                            "description": "Manage and track your school improvement easily, by creating tasks and planning project timelines"
                        },
                        {
                            "name": "Observations",
                            "img": "assets/images/ic_observation.svg",
                            "redirectionUrl": "/observation",
                            "listType": "listing",
                            "reportPage": true,
                            "description": ""
                        },
                        {
                            "name": "Survey",
                            "img": "assets/images/ic_survey.svg",
                            "redirectionUrl": "/listing/survey",
                            "listType": "survey",
                            "solutionType": "survey",
                            "reportPage": false,
                            "reportIdentifier": "surveyReportPage",
                            "description": "Provide information and feedback through quick and easy surveys"
                        },
                        {
                            "name": "Reports",
                            "img": "assets/images/ic_report.svg",
                            "redirectionUrl": "/project-report",
                            "listType": "report",
                            "reportPage": true,
                            "description": "Make sense of data to enable your decision-making based on your programs with ease",
                            "list": [
                                {
                                    "name": "Improvement Project Reports",
                                    "img": "assets/images/ic_project.svg",
                                    "redirectionUrl": "/project-report",
                                    "listType": "project",
                                    "solutionType": "improvementProject",
                                    "reportPage": false,
                                    "description": "Manage and track your school improvement easily, by creating tasks and planning project timelines"
                                },
                                {
                                    "name": "Survey Reports",
                                    "img": "assets/images/ic_survey.svg",
                                    "redirectionUrl": "/listing/survey",
                                    "listType": "survey",
                                    "solutionType": "survey",
                                    "reportPage": true,
                                    "reportIdentifier": "surveyReportPage",
                                    "description": "Provide information and feedback through quick and easy surveys"
                                },
                                {
                                    "name": "Observation Reports",
                                    "img": "assets/images/ic_observation.svg",
                                    "redirectionUrl": "/observation",
                                    "listType": "listing",
                                    "solutionType": "observation",
                                    "reportPage": true,
                                    "reportIdentifier": "surveyReportPage",
                                    "description": "Provide information and feedback through quick and easy observations"
                                }
                            ]
                        },
                        {
                            "name": "Library",
                            "img": "assets/images/library.svg",
                            "redirectionUrl": "/project-library",
                            "listType": "library",
                            "description": ""
                        }
                    ]
                }
            ]
        }
    }
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