import { Component, inject } from '@angular/core';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { actions } from 'src/app/config/actionContants';
import { ProfileService } from '../services/profile/profile.service';
import { AlertService } from '../services/alert/alert.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { SamikshaApiService } from '../services/samiksha-api/samiksha-api.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage {
  solutionList: any = { data: [], count: 0 };
  loader: LoaderService;
  solutionId!: string;
  listType!: keyof UrlConfig;
  searchTerm: any = "";
  toastService: ToastService;
  stateData: any;
  page: number = 1;
  limit: number = 10;
  filter = "assignedToMe";
  filters=actions.PROJECT_FILTERS;
  entityData:any;
  ProjectsApiService: ProjectsApiService;
  SamikshaApiService:SamikshaApiService;

  constructor(private navCtrl: NavController, private router: Router,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {
    this.ProjectsApiService = inject(ProjectsApiService);
    this.SamikshaApiService = inject(SamikshaApiService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ionViewWillEnter() {
    this.page = 1;
    this.solutionList = { data: [], count: 0 };
    this.getFormListing();
  }

  async getFormListing() {
    const urlSegments = this.router.url.split('/');
    const lastPathSegment: any = urlSegments[urlSegments.length - 1];
    this.listType = lastPathSegment;
    console.log('get url segments',urlSegments,this.listType)
    this.profileService.getFormListing().subscribe({
      next: (res: any) => {
        if (res?.status === 200 && res?.result) {
          const result = res.result.data;
          let solutionList = result.find((item: any) => item.type === 'solutionList');
          solutionList = {
            "type": "solutionList",
            "listingData": [
                {
                    "name": "Projects",
                    "img": "assets/images/ic_project.svg",
                    "redirectionUrl": "/listing/project",
                    "listType": "project",
                    "solutionType":"improvementProject",
                    "reportPage":false,
                    "description": "Manage and track your school improvement easily, by creating tasks and planning project timelines"
                },
                {
                  "name": "Survey",
                  "img": "assets/images/ic_survey.svg",
                  "redirectionUrl": "/listing/survey",
                  "listType": "survey",
                  "solutionType":"survey",
                  "reportPage":false,
                  "reportIdentifier":"surveyReportPage",
                  "description": "Provide information and feedback through quick and easy surveys"
              },
                {
                    "name": "Reports",
                    "img": "assets/images/ic_report.svg",
                    "redirectionUrl": "/list/report",
                    "listType": "report",
                    "reportPage":true,
                    "description": "Make sense of data to enable your decision-making based on your programs with ease",
                    "list":[
                      {
                        "name": "Improvement Project Reports",
                        "img": "assets/images/ic_project.svg",
                        "redirectionUrl": "/project-report",
                        "listType": "project",
                        "solutionType":"improvementProject",
                        "reportPage":false,
                        "description": "Manage and track your school improvement easily, by creating tasks and planning project timelines"
                    },
                    {
                      "name": "Survey Reports",
                      "img": "assets/images/ic_survey.svg",
                      "redirectionUrl": "/listing/survey-report",
                      "listType": "survey-report",
                      "solutionType":"survey",
                      "reportPage":true,
                      "reportIdentifier":"surveyReportPage",
                      "description": "Provide information and feedback through quick and easy surveys"
                  }
                    ]
                }
            ]
        }
          if(this.listType !== 'project'){
            this.filter = ''
          }
          if (solutionList) {
             solutionList.listingData.find((data: any) => {
              if (data.listType === this.listType) {
                this.stateData = data
                return true;
              } else if (data.listType === 'report') {
                const reportSolution = data.list.find((item: any) => item.listType === this.listType);
                if (reportSolution) {
                  this.stateData = reportSolution; 
                  return true;
                }
              }
              return false; 
            });
                  
          console.log('state data',this.stateData)
            this.getProfileDetails();
          }
        }
      },
      error: (err: any) => {
        this.toastService.presentToast(err?.error?.message, 'danger');
      }
    }
    );
  }

  ionViewWillLeave() {
    this.alertService.dismissAlert();
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.page = 1;
    this.solutionList = { data: [], count: 0 };
    this.getListData();
  }
  filterChanged(event: any) {
    this.solutionList = { data: [], count: 0 }
    this.page = 1;
    this.getListData()
  }

  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
      if (mappedIds) {
        this.entityData = mappedIds;
        this.getListData();
      }
    });
  }

  async getListData() {
    await this.loader.showLoading("Please wait while loading...");
    (this.listType == 'project' ? this.ProjectsApiService : this.SamikshaApiService)
      .post(
        urlConfig[this.listType].listingUrl + `?type=${this.stateData.solutionType}&page=${this.page}&limit=${this.limit}&filter=${this.filter}&search=${this.searchTerm}${this.stateData.reportIdentifier ? `&` +this.stateData.reportIdentifier+`=`+this.stateData.reportPage : ''}`, this.entityData)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
        })
      )
      .subscribe((res: any) => {
        if (res?.status == 200) {
          this.solutionList.data = this.solutionList?.data.concat(res?.result?.data);
          this.solutionList.count = res?.result?.count;
        } else {
          this.toastService.presentToast(res?.message, 'warning');
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message, 'danger');
        }
      );
  }

  loadData() {
    this.page = this.page + 1;
    this.getListData();
  }

  goBack() {
    this.navCtrl.back();
  }

  navigateTo(data: any) {
    console.log(data)
    if(this.listType == 'project'){
      this.router.navigate(['project-details'], { state: data });
    }else if(this.listType == 'survey'){
      this.router.navigate(['questionnaire',data.solutionId])
    }
  }
}