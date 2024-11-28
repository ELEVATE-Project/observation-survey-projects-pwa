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
  spotlightstories:any[]=[];
  myImprovements: any[] = [];
  recommendationList:any[]=[];
  formListingUrl = (environment.baseURL.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['formListing'].listingUrl;
  swiperModules = [IonicSlides];
  jsonData: any;
  baseApiService: any;
  authService: AuthService;
  toastService: any;
  loader: LoaderService;
  userName:any;
  headerConfig:any;
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
    this.setHeaderConfig();
    this.clearDatabaseHandler = this.handleMessage.bind(this);
      window.addEventListener('message', this.clearDatabaseHandler);
  }
  setHeaderConfig() {
    this.userName =localStorage.getItem('name')
    this.translate
      .get('WELCOME_MESSAGE', { name: this.userName })
      .subscribe((translatedTitle) => {
        this.headerConfig = {
          title: translatedTitle,
          customActions: [{ icon: 'bookmark-outline', actionName: 'save' }],
        };
      });
  }
  handleActionClick(actionName:String) {
    
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