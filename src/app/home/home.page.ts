import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
import { finalize, of } from 'rxjs';
import { FETCH_HOME_FORM, FETCH_HOME_FORM_PROJECT, FETCH_HOME_FORM_SURVEY } from '../core/constants/formConstant';
import { AuthService } from 'authentication_frontend_library';
import { UtilService } from 'src/app/services/util/util.service';
import { ProfileService } from '../services/profile/profile.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { environment } from 'src/environments/environment';
import { PAGE_IDS } from '../core/constants/pageIds';
import {DbService, FormsService} from 'formstore-cache'
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  showHeader = environment.showHeader;
  logoPath = environment.config.logoPath;
  formListingUrl = (environment.capabilities.includes('all') || environment.capabilities.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['formListing'].listingUrl;
  swiperModules = [IonicSlides];
  jsonData: any;
  baseApiService: any;
  authService: AuthService;
  toastService: any;
  loader: LoaderService;
  dbService: DbService;
  solutionList: any = [];
  isMobile = this.utilService.isMobile();
  typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};
  @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
  @ViewChild('solutionTemplate') solutionTemplate!: TemplateRef<any>;
  @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;
  clearDatabaseHandler:any;
  pageIdsList = PAGE_IDS

  constructor(private http: HttpClient, private router: Router, private utilService: UtilService,
    private profileService: ProfileService
  ) {
    this.baseApiService = inject(ProjectsApiService);
    this.loader = inject(LoaderService)
    this.authService = inject(AuthService)
    this.toastService = inject(ToastService)
    this.dbService = inject(DbService)
  }

  ionViewWillEnter() {
    this.clearDatabaseHandler = this.handleMessage.bind(this);
      window.addEventListener('message', this.clearDatabaseHandler);
    this.getHomeListing();
  }
  startScan() {
    this.router.navigate(['/qr-scanner']);
  }

  async getHomeListing() {
    await this.loader.showLoading("LOADER_MSG");
    this.baseApiService
      .post(
        this.formListingUrl, environment.capabilities == 'all' ? FETCH_HOME_FORM :  environment.capabilities == 'survey' ? FETCH_HOME_FORM_SURVEY : FETCH_HOME_FORM_PROJECT)
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

  navigateTo(data: any) {
    if(data.listType == 'report'){
      this.router.navigate(['report/list'], { queryParams: { type: data.listType } });
    }else{
      this.utilService.navigateTo(data)
    }
  }

  logout() {
    this.authService.logout();
  }
  async handleMessage(event: MessageEvent) {
    if (event.data && event.data.msg) {
      this.utilService.clearDatabase();
      this.dbService.clearDatabase();
      document.documentElement.style.setProperty('--ion-color-primary', '#832215');
      document.documentElement.style.setProperty('--ion-color-secondary', '#ffffff');
      document.documentElement.style.setProperty('--primary-color', '#832215');
      document.documentElement.style.setProperty('--color-primary', '#832215');
    }
  }
}