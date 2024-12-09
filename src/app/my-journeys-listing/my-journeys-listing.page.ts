import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile/profile.service';
import { LoaderService } from '../services/loader/loader.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';

@Component({
  selector: 'app-my-journeys-listing',
  templateUrl: './my-journeys-listing.page.html',
  styleUrls: ['./my-journeys-listing.page.scss'],
})
export class MyJourneysListingPage  {
  headerConfig = {
    title:"MY_JOURNEYS"
  }
  myjourneys :any[]=[];
  page = 1;
  limit = 15;
  count = 0;
  disableLoading: boolean = false;
  pageConfig: any = {};
  profilePayload: any = {};

  constructor(
    private route:Router,
    private profileService: ProfileService,
    private loaderService: LoaderService,
    private projectsApiService: ProjectsApiService,
    private toastService: ToastService
  ) { }

  ionViewWillEnter(){
    this.getProfileDetails();
    console.log(this.myjourneys);
  }

  getProfileDetails() {
    this.profileService
      .getProfileAndEntityConfigData()
      .subscribe((mappedIds) => {
        if (mappedIds) {
          this.profilePayload = mappedIds;
          this.getJourneys();
          console.log(this.myjourneys.length);
        }
      });
  }


  async getJourneys($event?: any) {
    await this.loaderService.showLoading('LOADER_MSG');
    let url = `${urlConfig.program.listingUrl}?isAPrivateProgram=true&page=${this.page}&limit=${this.limit}&search=&getProjectsCount=true`;
    this.projectsApiService.post(url,{}).subscribe({
      next: async (response: any) => {
        await this.loaderService.dismissLoading();
        if (response.status == 200) {
          this.myjourneys = this.myjourneys.concat(
            response.result.data
          );
          this.count = response.result.count;
          this.disableLoading =
            !this.myjourneys.length ||
            this.myjourneys.length == response.result.count;
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
    this.getJourneys($event);
  }

  ionViewWillLeave(){
    this.myjourneys = [];
    this.count=0;
    this.page=1;
    this.limit=10;
    this.disableLoading = true;
  }

}