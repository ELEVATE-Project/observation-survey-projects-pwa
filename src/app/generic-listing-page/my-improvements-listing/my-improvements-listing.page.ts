import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ProjectsApiService } from '../../services/projects-api/projects-api.service';
import { ToastService } from '../../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';

@Component({
  selector: 'app-my-improvements-listing',
  templateUrl: './my-improvements-listing.page.html',
  styleUrls: ['./my-improvements-listing.page.scss'],
})
export class MyImprovementsListingPage  {
  headerConfig = {
    title: 'MY_IMPROVEMENTS',
    showBackButton: true,
  };
  myImprovements: any[] = [];
  page = 1;
  limit = 15;
  count = 0;
  disableLoading: boolean = false;
  pageConfig: any = {};
  profilePayload: any = {};

  constructor(
    private profileService: ProfileService,
    private loaderService: LoaderService,
    private projectsApiService: ProjectsApiService,
    private toastService: ToastService
  ) {}

  ionViewWillEnter(){
    this.getProfileDetails();
  }

  getProfileDetails() {
    this.profileService
      .getProfileAndEntityConfigData()
      .subscribe((mappedIds) => {
        if (mappedIds) {
          this.profilePayload = mappedIds;
          this.getImprovements();
        }
      });
  }

  async getImprovements($event?: any) {
    await this.loaderService.showLoading('LOADER_MSG');
    let url = `${urlConfig.project.myImprovementsUrl}?&page=${this.page}&limit=${this.limit}&search=&status=inProgress`;
    this.projectsApiService.post(url,{}).subscribe({
      next: async (response: any) => {
        await this.loaderService.dismissLoading();
        if (response.status == 200) {
          this.myImprovements = this.myImprovements.concat(
            response.result.data
          );
          this.count = response.result.count;
          this.disableLoading =
            !this.myImprovements.length ||
            this.myImprovements.length == response.result.count;
        } else {
          this.toastService.presentToast(response.message, 'danger');
        }
        if ($event) {
          $event.target.complete();
        }
      },
      error: async (error: any) => {
        await this.loaderService.dismissLoading();
        this.toastService.presentToast(error.error.message, 'danger');
      },
    });
  }

  loadData($event: any) {
    this.page += 1;
    this.getImprovements($event);
  }

  ionViewWillLeave(){
    this.myImprovements = [];
    this.count=0;
    this.page=1;
    this.limit=10;
    this.disableLoading = true;
  }
}
