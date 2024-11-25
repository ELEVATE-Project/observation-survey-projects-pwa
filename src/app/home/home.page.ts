import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FETCH_HOME_FORM } from '../core/constants/formConstant';
import { AuthService } from 'authentication_frontend_library';
import { UtilService } from 'src/app/services/util/util.service';
import { ProfileService } from '../services/profile/profile.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core'
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  formListingUrl = (environment.baseURL.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['formListing'].listingUrl;
  swiperModules = [IonicSlides];
  jsonData: any;
  baseApiService: any;
  authService: AuthService;
  toastService: any;
  loader: LoaderService;
  solutionList: any = [];
  name:any= localStorage.getItem('name')
  headerConfig:any;
  isMobile = this.utilService.isMobile();
  typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};
  @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
  @ViewChild('solutionTemplate') solutionTemplate!: TemplateRef<any>;
  @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;
  clearDatabaseHandler:any;


  constructor(private http: HttpClient, private router: Router, private utilService: UtilService,
    private profileService: ProfileService,private translate: TranslateService
  ) {
    this.baseApiService = inject(ProjectsApiService);
    this.loader = inject(LoaderService)
    this.authService = inject(AuthService)
    this.toastService = inject(ToastService)
    this.setHeaderConfig();
  }

  ionViewWillEnter() {
    this.clearDatabaseHandler = this.handleMessage.bind(this);
      window.addEventListener('message', this.clearDatabaseHandler);
    this.getHomeListing();
  }
  setHeaderConfig() {
    this.translate
      .get('WELCOME_MESSAGE', { name: this.name })
      .subscribe((translatedTitle) => {
        this.headerConfig = {
          title: translatedTitle,
          customActions: [{ icon: 'bookmark-outline', actionName: 'save' }],
        };
      });
  }
  handleActionClick(actionName:String) {
    this.router.navigate(['/save'])
  }

  async getHomeListing() {
    await this.loader.showLoading("LOADER_MSG");
    this.baseApiService
      .post(
        this.formListingUrl, FETCH_HOME_FORM)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
        })
      )
      .subscribe((res: any) => {
        if (res?.status === 200) {
          if (res?.result) {
            this.solutionList = res?.result?.data;
          }
          this.typeTemplateMapping = {
            "bannerList": this.bannerTemplate,
            "solutionList": this.solutionTemplate,
            "recomendationList": this.recommendationTemplate
          };
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message,"danger");
        }
      );
  }


  logout() {
    this.authService.logout();
  }
  async handleMessage(event: MessageEvent) {
    if (event.data && event.data.msg) {
      this.utilService.clearDatabase();
    }
  }
}