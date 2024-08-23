import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
import { AuthService } from 'authentication_frontend_library';
import { UtilService } from 'src/app/services/util/util.service';
import { ProfileService } from '../services/profile/profile.service';
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


  constructor(private http: HttpClient, private router: Router, private utilService: UtilService,
    private profileService: ProfileService
  ) {
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
    this.profileService.getFormListing().subscribe({
      next: (res: any) => {
        if (res?.status === 200 && res?.result) {
          this.solutionList = res?.result?.data;
        }
        this.typeTemplateMapping = {
          "bannerList": this.bannerTemplate,
          "solutionList": this.solutionTemplate,
          "recomendationList": this.recommendationTemplate
        };
      },
      error: (err: any) => {
        this.toastService.presentToast(err?.error?.message, 'danger');
      }
    }
    );
  }

  logout() {
    this.authService.logout();
  }
}