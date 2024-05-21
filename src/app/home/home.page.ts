import { Component, OnInit, TemplateRef, ViewChild, inject  } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import { ApiBaseService } from '../services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json';
import { UrlConfig } from '../interfaces/main.interface';
import { ToastService } from '../services/toast/toast.service';
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  swiperModules = [IonicSlides];
  jsonData:any;
  baseApiService: any;
  toastService:any;
  loader: LoaderService;
   listType: keyof UrlConfig = 'homeListing';
  typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};
  @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
  @ViewChild('productTemplate') productTemplate!: TemplateRef<any>;
  @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;

  constructor(private http: HttpClient) { 
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
     this.toastService = inject(ToastService)
  }

  ngOnInit() {
    this.http.get<any>('assets/listingData.json').subscribe(data => {
      this.jsonData = data;
      this.typeTemplateMapping = {
        "banner": this.bannerTemplate,
        "solutionList": this.productTemplate,
        "Recomendation": this.recommendationTemplate
      };
    });

    this.getHomeListing();
  }

  getHomeListing() {
    this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .post(
        urlConfig[this.listType].listingUrl)
      .subscribe((res: any) => {
        this.loader.dismissLoading();
        if (res?.result) {

        } else {
          // this.errorDialog();
        }
        // this.showSpinner = false;
      },
    (err:any) => {
      this.loader.dismissLoading();
      this.toastService.presentToast("Error");
    }
    );
  }

}