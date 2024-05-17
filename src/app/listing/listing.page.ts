import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import { ActivatedRoute } from '@angular/router';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  listData: any;
  baseApiService: any;
  loader: LoaderService;
  solutionId!: string;
  listType!: keyof UrlConfig;
  route: ActivatedRoute;
  listTitle!: string;
  listDescription!: string;
  searchTerm: any = "";
  toastService:ToastService;

  constructor(private http: HttpClient) {
    this.route = inject(ActivatedRoute);
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
     this.toastService = inject(ToastService)
  }

  ngOnInit() {
    this.route.params.subscribe((param: any) => {
      console.log(param)
      this.listType = param['type'];
    });
    this.http.get<any>('assets/listingData.json').subscribe(data => {
      this.listData = data;
      data.forEach((ele: any) => {
        if (ele?.type == "solutionList") {
          ele?.data?.forEach((res: any) => {
            if (res?.listType == this.listType) {
              this.listTitle = res?.name;
              this.listDescription = res?.description;
            }
          });
        }
      });
    });
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.getListData();
  }

  getListData() {
    this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .post(
        urlConfig[this.listType].listingUrl + `?page=1&limit=10&search=${this.searchTerm}&filter=createdByMe`)
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
