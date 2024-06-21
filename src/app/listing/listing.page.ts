import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import {  Router } from '@angular/router';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  solutionList: any = { data: [], count: 0 };
  baseApiService: any;
  loader: LoaderService;
  solutionId!: string;
  listType!: keyof UrlConfig;
  searchTerm: any = "";
  toastService: ToastService;
  stateData: any;
  page: number = 1;
  limit: number = 10;
  constructor(private http: HttpClient, private navCtrl: NavController, private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.stateData = navigation.extras.state;
      this.listType = this.stateData?.listType;
    }
  }

  ionViewWillEnter() {
    this.page = 1;
    this.solutionList = { data: [], count: 0 }
    this.getListData();
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.page = 1;
    this.solutionList = { data: [], count: 0 };
    this.getListData();
  }

  async getListData() {
    await this.loader.showLoading("Please wait while loading...");
    const entityData = {
      "entityType": "block",
      "entities": [
        "5fd1b52ab53a6416aaeefc80",
        "5fd098e2e049735a86b748ac",
        "5fd1b52ab53a6416aaeefc83",
        "5fd1b52ab53a6416aaeefb20"
      ],
      "role": "HM,BEO"
    }
    this.baseApiService
      .post(
        urlConfig[this.listType].listingUrl + `?type=improvementProject&page=${this.page}&limit=${this.limit}&filter=&search=${this.searchTerm}`, entityData)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
        })
      )
      .subscribe((res: any) => {
        if (res?.status == 200) {
          this.solutionList.data = this.solutionList?.data.concat(res?.result?.data);
          this.solutionList.count = res?.result?.count;
        } else {
          this.toastService.presentToast(res?.message);
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message);
        }
      );
  }

  loadData() {
    this.page = this.page + 1;
    this.getListData();
  }

  goBack() {
    this.navCtrl.back();
  }

  navigateToProject(data: any) {
    this.router.navigate(['project-details'], { state: data });
  }
}