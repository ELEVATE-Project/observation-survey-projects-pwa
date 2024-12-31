import { Component, inject } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { LoaderService } from '../services/loader/loader.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile/profile.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { TranslateService } from '@ngx-translate/core'
import { catchError, combineLatest, finalize, map, of } from 'rxjs';
import { GwApiService } from '../services/gw-api/gw-api.service';
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
  swiperModules = [IonicSlides];
  jsonData: any;
  baseApiService: any;
  toastService: any;
  loader: LoaderService;
  userName:any;
  headerConfig:any;
  clearDatabaseHandler:any;
  page=1;
  limit=4;
  improvementsCount=0;
  spotlightCount=0;
  recommendationCount=0;
  profilePayload:any;
  noData:boolean=false;


  constructor(private router: Router, private profileService: ProfileService,private translate: TranslateService, private gwApiService: GwApiService) {
    this.baseApiService = inject(ProjectsApiService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
    this.setHeaderConfig();
  }

  ionViewWillEnter() {
    this.noData=true
    this.languageSetting();
    this.setHeaderConfig();
      this.getProfileDetails();
  }
  setHeaderConfig() {
    this.userName =localStorage.getItem('name')
    if(this.userName.length > 50){
      this.userName = this.userName.substring(0, 50) + '...'
    }
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
    this.router.navigate(['list/saved'])
  }


  async getProfileDetails() {
  await this.loader.showLoading("LOADER_MSG")
    this.profileService.getProfileAndEntityConfigData().subscribe(async (mappedIds) => {
      if (mappedIds) {
        this.profilePayload = mappedIds;
        this.getRecommendation()
      await  this.getdata();
      }
    });
  }

  getRecommendation(){
    let url = `${urlConfig.recommendation.listingUrl}?page=${this.page}&limit=${this.limit}`
    this.gwApiService.get(url).subscribe({
      next: async(response: any)=>{
        this.recommendationList = response?.result?.data || []
        this.recommendationCount = response?.result?.count || 0
      },
      error: async(error:any)=>{
        this.toastService.presentToast(error.error.message, 'danger')
      }
    })
  }

async  getdata() {
  this.noData=true;
    let  improvements =  `${urlConfig.project.myImprovementsUrl}?&page=${this.page}&limit=${this.limit}&language=en`;
    const urls = {
      spotlight: `${urlConfig.project.spotlightUrl}&page=${this.page}&limit=${this.limit}`,
    };
    const fetchDataImprovements = (url:any) =>
      this.baseApiService.post(url,{}).pipe(
        catchError((err) => {
          this.toastService.presentToast(err.error.message, 'danger');
          return of({ status: 'error', result: { data: [], count: 0 } });
        }));

    const fetchData = (url: string) =>
      this.baseApiService.get(url).pipe(
        catchError((err) => {
          this.toastService.presentToast(err.error.message, 'danger');
          return of({ status: 'error', result: { data: [], count: 0 } });
        })
      );

    return combineLatest([
      fetchDataImprovements(improvements),
      fetchData(urls.spotlight),
    ])
      .pipe(
        map(([improvementRes, spotlightRes]: any) => {
          this.myImprovements = improvementRes.result.data;
          this.improvementsCount = improvementRes.result.count;

          this.spotlightstories = spotlightRes.result.data;
          this.spotlightCount = spotlightRes.result.count;

        }),
        finalize(async () => {
          await this.loader.dismissLoading();
          this.noData=false;
        })
      )
      .subscribe({
        error: (err) => {
          this.toastService.presentToast(err.message || 'An error occurred', 'danger');
        },
      });
  }

  languageSetting(){
    let language = localStorage.getItem('preferred_language')
    if (language) {
      const parsedLanguage = JSON.parse(language);
      if (parsedLanguage?.value) {
        this.translate.use(parsedLanguage.value);
      }
  }
}

  create(){
    window.location.href = "/create-project/mitra-chat"
  }

}