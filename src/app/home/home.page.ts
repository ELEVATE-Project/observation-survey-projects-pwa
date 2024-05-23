import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import { ApiBaseService } from '../services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  swiperModules = [IonicSlides];
  jsonData: any;
  baseApiService: any;
  toastService: any;
  loader: LoaderService;
  listResData: any = [];
  typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};
  @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
  @ViewChild('productTemplate') productTemplate!: TemplateRef<any>;
  @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ngOnInit() {
    this.getHomeListing();
  }

  getHomeListing() {
    this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .post(
        urlConfig['homeListing'].listingUrl)
      .subscribe((res: any) => {
        if (res?.message == 'Forms version fetched successfully') {
          const formData = res?.result;
          const homeListData = formData.find((item: any) => item.type === "home");

          this.baseApiService
            .post(
              urlConfig['homeListing'].listingUrl + `/${homeListData?._id}`)
            .subscribe((res: any) => {
              if (res?.result) {
                this.listResData = res?.result?.data;
              }
              this.typeTemplateMapping = {
                "banner": this.bannerTemplate,
                "solutionList": this.productTemplate,
                "Recomendation": this.recommendationTemplate
              };
            },
              (err: any) => {
                this.toastService.presentToast(err?.error?.message);
              }
            );
          this.loader.dismissLoading();
        }
      },
        (err: any) => {
          this.loader.dismissLoading();
          this.toastService.presentToast(err?.error?.message);
        }
      );
  }

  navigateTo(data: any) {
    this.router.navigate([data?.redirectionUrl], { state: data });
  }
}