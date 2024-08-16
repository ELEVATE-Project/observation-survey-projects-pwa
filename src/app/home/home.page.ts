import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import { ApiBaseService } from '../services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FETCH_HOME_FORM } from '../core/constants/formConstant';
import { AuthService } from 'authentication_frontend_library';
import { UtilService } from 'src/app/services/util/util.service';
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  swiperModules = [IonicSlides];
  jsonData: any;
  baseApiService: any;
  authService: AuthService;
  toastService: any;
  loader: LoaderService;
  solutionList: any = [];
  isMobile = this.utilService.isMobile();
  typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};
  @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
  @ViewChild('solutionTemplate') solutionTemplate!: TemplateRef<any>;
  @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;


  constructor(private http: HttpClient, private router: Router,private utilService: UtilService) {
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.authService = inject(AuthService)
    this.toastService = inject(ToastService)
  }

  ionViewWillEnter() {
    this.getHomeListing();
  }
  startScan() {
    this.router.navigate(['/qr-scanner']);
  }

  async getHomeListing() {
    await this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .post(
        urlConfig['formListing'].listingUrl, FETCH_HOME_FORM)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
        })
      )
      .subscribe((res: any) => {
        if (res?.status === 200) {
          if (res?.result) {
            this.solutionList = res?.result?.data;
            this.solutionList = [
              // {
              //     "type": "bannerList",
              //     "listingData": [
              //         {
              //             "title": "Hey, Welcome back!",
              //             "discription": ""
              //         }
              //     ]
              // },
              {
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
                        "img": "assets/images/ic_project.svg",
                        "redirectionUrl": "/listing/survey",
                        "listType": "survey",
                        "solutionType":"survey",
                        "reportPage":false,
                        "description": "Provide information and feedback through quick and easy surveys"
                    },
                      {
                          "name": "Reports",
                          "img": "assets/images/ic_report.svg",
                          "redirectionUrl": "/list/report",
                          "listType": "report",
                          "reportPage":true,
                          "description": "Make sense of data to enable your decision-making based on your programs with ease"
                      }
                  ]
              }
          ]
          }
          this.typeTemplateMapping = {
            "bannerList": this.bannerTemplate,
            "solutionList": this.solutionTemplate,
            "recomendationList": this.recommendationTemplate
          };
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message);
        }
      );
  }

  navigateTo(data: any) {
    this.router.navigate([data?.redirectionUrl], { state: data });
  }

  logout() {
    this.authService.logout();
  }
}