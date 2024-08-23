import { Component, inject } from '@angular/core';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import { Router } from '@angular/router';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { actions } from 'src/app/config/actionContants';
import { ProfileService } from '../services/profile/profile.service';
import { AlertService } from '../services/alert/alert.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage {
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
  filter = "assignedToMe";
  filters=actions.PROJECT_FILTERS;
  solutionType!: string;
  entityData:any;

  constructor(private navCtrl: NavController, private router: Router,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ionViewWillEnter() {
    this.page = 1;
    this.solutionList = { data: [], count: 0 };
    this.getFormListing();
  }

  async getFormListing() {
    const urlSegments = this.router.url.split('/');
    const lastPathSegment: any = urlSegments[urlSegments.length - 1];
    this.listType = lastPathSegment;

    this.profileService.getFormListing().subscribe({
      next: (res: any) => {
        if (res?.status === 200 && res?.result) {
          const result = res.result.data;
          const solutionList = result.find((item: any) => item.type === 'solutionList');

          if (solutionList) {
            this.stateData = solutionList.listingData.find((data: any) => data.listType === this.listType);
            this.getProfileDetails();
          }
        }
      },
      error: (err: any) => {
        this.toastService.presentToast(err?.error?.message, 'danger');
      }
    }
    );
  }

  ionViewWillLeave() {
    this.alertService.dismissAlert();
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.page = 1;
    this.solutionList = { data: [], count: 0 };
    this.getListData();
  }
  filterChanged(event: any) {
    this.solutionList = { data: [], count: 0 }
    this.page = 1;
    this.getListData()
  }

  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
      if (mappedIds) {
        this.entityData = mappedIds;
        this.getListData();
      }
    });
  }

  async getListData() {
    await this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .post(
        urlConfig[this.listType].listingUrl + `?type=${this.solutionType}&page=${this.page}&limit=${this.limit}${this.listType == 'project' ? '&filter='+ this.filter:''}&search=${this.searchTerm}${this.stateData.reportIdentifier ? `&` +this.stateData.reportIdentifier+`=`+this.stateData.reportPage : ''}`, this.entityData)
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
          this.toastService.presentToast(res?.message, 'warning');
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message, 'danger');
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