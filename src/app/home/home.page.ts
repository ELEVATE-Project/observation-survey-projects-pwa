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

  setProfile(){
    let refToken= `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo1OSwibmFtZSI6IklzaGFhbiIsInNlc3Npb25faWQiOjU2MDAsIm9yZ2FuaXphdGlvbl9pZHMiOlsiOCJdLCJvcmdhbml6YXRpb25fY29kZXMiOlsiYmxyIl0sInRlbmFudF9jb2RlIjoic2hpa3NoYWdyYWhhIiwib3JnYW5pemF0aW9ucyI6W3siaWQiOjgsIm5hbWUiOiJCZW5nYWx1cnUiLCJjb2RlIjoiYmxyIiwiZGVzY3JpcHRpb24iOiJCZW5nYWx1cnUgaXMgdGhlIGNhcGl0YWwgb2YgSW5kaWFzIHNvdXRoZXJuIEthcm5hdGFrYSBzdGF0ZS4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJyZWxhdGVkX29yZ3MiOls5XSwidGVuYW50X2NvZGUiOiJzaGlrc2hhZ3JhaGEiLCJtZXRhIjp7InRlcm1zIjpbeyJpZGVudGlmaWVyIjoibWlncmF0aW9uLWZyYW1ld29ya19ib2FyZF9jYnNlIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfYm9hcmRfY2JzZSJ9LHsiaWRlbnRpZmllciI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfbWVkaXVtX2VuZ2xpc2giLCJub2RlX2lkIjoibWlncmF0aW9uLWZyYW1ld29ya19tZWRpdW1fZW5nbGlzaCJ9LHsiaWRlbnRpZmllciI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfZ3JhZGVsZXZlbF9ncmFkZTEwIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfZ3JhZGVsZXZlbF9ncmFkZTEwIn0seyJpZGVudGlmaWVyIjoibWlncmF0aW9uLWZyYW1ld29ya19zdWJqZWN0X2hpbmRpIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9oaW5kaSJ9LHsiaWRlbnRpZmllciI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9lbmdsaXNoIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9lbmdsaXNoIn0seyJpZGVudGlmaWVyIjoibWlncmF0aW9uLWZyYW1ld29ya19zdWJqZWN0X21hdGhzIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9tYXRocyJ9XSwiZnJhbWV3b3JrIjp7Im5vZGVfaWQiOiJtaWdyYXRpb24tZnJhbWV3b3JrIiwidmVyc2lvbktleSI6IjE3NDI4ODU3Njc4NDEifX0sImNyZWF0ZWRfYnkiOjEsInVwZGF0ZWRfYnkiOm51bGwsInJvbGVzIjpbeyJpZCI6MTUsInRpdGxlIjoibWVudGVlIiwibGFiZWwiOm51bGwsInVzZXJfdHlwZSI6MCwic3RhdHVzIjoiQUNUSVZFIiwib3JnYW5pemF0aW9uX2lkIjo3LCJ2aXNpYmlsaXR5IjoiUFVCTElDIiwidGVuYW50X2NvZGUiOiJzaGlrc2hhZ3JhaGEiLCJ0cmFuc2xhdGlvbnMiOm51bGx9LHsiaWQiOjMzLCJ0aXRsZSI6ImxlYXJuZXIiLCJsYWJlbCI6IkxlYXJuZXIiLCJ1c2VyX3R5cGUiOjAsInN0YXR1cyI6IkFDVElWRSIsIm9yZ2FuaXphdGlvbl9pZCI6NywidmlzaWJpbGl0eSI6IlBVQkxJQyIsInRlbmFudF9jb2RlIjoic2hpa3NoYWdyYWhhIiwidHJhbnNsYXRpb25zIjpudWxsfV19XX0sImlhdCI6MTc0OTE4NDUzMywiZXhwIjoxNzQ5MjcwOTMzfQ._DsIVK8rPveX16ycAVHrdtJTV7CIXvjz-AFOFFawG5s`
    let accToken= `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo1OSwibmFtZSI6IklzaGFhbiIsInNlc3Npb25faWQiOjUwMjcsIm9yZ2FuaXphdGlvbl9pZHMiOlsiOCJdLCJvcmdhbml6YXRpb25fY29kZXMiOlsiYmxyIl0sInRlbmFudF9jb2RlIjoic2hpa3NoYWdyYWhhIiwib3JnYW5pemF0aW9ucyI6W3siaWQiOjgsIm5hbWUiOiJCZW5nYWx1cnUiLCJjb2RlIjoiYmxyIiwiZGVzY3JpcHRpb24iOiJCZW5nYWx1cnUgaXMgdGhlIGNhcGl0YWwgb2YgSW5kaWFzIHNvdXRoZXJuIEthcm5hdGFrYSBzdGF0ZS4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJyZWxhdGVkX29yZ3MiOls5XSwidGVuYW50X2NvZGUiOiJzaGlrc2hhZ3JhaGEiLCJtZXRhIjp7InRlcm1zIjpbeyJpZGVudGlmaWVyIjoibWlncmF0aW9uLWZyYW1ld29ya19ib2FyZF9jYnNlIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfYm9hcmRfY2JzZSJ9LHsiaWRlbnRpZmllciI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfbWVkaXVtX2VuZ2xpc2giLCJub2RlX2lkIjoibWlncmF0aW9uLWZyYW1ld29ya19tZWRpdW1fZW5nbGlzaCJ9LHsiaWRlbnRpZmllciI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfZ3JhZGVsZXZlbF9ncmFkZTEwIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfZ3JhZGVsZXZlbF9ncmFkZTEwIn0seyJpZGVudGlmaWVyIjoibWlncmF0aW9uLWZyYW1ld29ya19zdWJqZWN0X2hpbmRpIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9oaW5kaSJ9LHsiaWRlbnRpZmllciI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9lbmdsaXNoIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9lbmdsaXNoIn0seyJpZGVudGlmaWVyIjoibWlncmF0aW9uLWZyYW1ld29ya19zdWJqZWN0X21hdGhzIiwibm9kZV9pZCI6Im1pZ3JhdGlvbi1mcmFtZXdvcmtfc3ViamVjdF9tYXRocyJ9XSwiZnJhbWV3b3JrIjp7Im5vZGVfaWQiOiJtaWdyYXRpb24tZnJhbWV3b3JrIiwidmVyc2lvbktleSI6IjE3NDI4ODU3Njc4NDEifX0sImNyZWF0ZWRfYnkiOjEsInVwZGF0ZWRfYnkiOm51bGwsInJvbGVzIjpbeyJpZCI6MTUsInRpdGxlIjoibWVudGVlIiwibGFiZWwiOm51bGwsInVzZXJfdHlwZSI6MCwic3RhdHVzIjoiQUNUSVZFIiwib3JnYW5pemF0aW9uX2lkIjo3LCJ2aXNpYmlsaXR5IjoiUFVCTElDIiwidGVuYW50X2NvZGUiOiJzaGlrc2hhZ3JhaGEiLCJ0cmFuc2xhdGlvbnMiOm51bGx9LHsiaWQiOjMzLCJ0aXRsZSI6ImxlYXJuZXIiLCJsYWJlbCI6IkxlYXJuZXIiLCJ1c2VyX3R5cGUiOjAsInN0YXR1cyI6IkFDVElWRSIsIm9yZ2FuaXphdGlvbl9pZCI6NywidmlzaWJpbGl0eSI6IlBVQkxJQyIsInRlbmFudF9jb2RlIjoic2hpa3NoYWdyYWhhIiwidHJhbnNsYXRpb25zIjpudWxsfV19XX0sImlhdCI6MTc0ODg0NTE2NywiZXhwIjoxNzQ4OTMxNTY3fQ.UPbmunABJVQZz-8mdtCXEsoMY-WIcgSR3_g6A0CG3u8`
    let profileData={
      "state": "67c82d0c538125889163f197",
      "district": "67c82d37bad58c889bc5a5de",
      "block": "67c82d7abad58c889bc5a643",
      "cluster": "67c82d53538125889163f3cd",
      "school": "67c82d985381258891643d0b",
      "professional_role": "681b076ef21c88cef9517e0a",
      "professional_subroles": "681b0894f21c88cef9517e12,681b0a369c57cdcf03c79ae7,681b0af29c57cdcf03c79aeb,6822fd5f4e2812081f342608,6822fdd94e2812081f34260f,6822fdf64e2812081f342613,6822fe0d4e2812081f342617,6822fe2a4e2812081f34261b,6822fe4d4e2812081f34261f,6822fe774e2812081f342623",
      "organizations": ""
  }
  let data:any={"org-id":"8"}
  let Theme:any={"primaryColor":"#572E91","secondaryColor":"#FF9911"}
  localStorage.setItem("headers",JSON.stringify(data))
  localStorage.setItem("profileData",JSON.stringify(profileData))
  localStorage.setItem('accToken',accToken)
  localStorage.setItem('refToken',refToken)
  localStorage.setItem('theme',JSON.stringify(Theme))
  }
}