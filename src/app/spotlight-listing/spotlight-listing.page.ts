import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { ProfileService } from '../services/profile/profile.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';

@Component({
  selector: 'app-spotlight-listing',
  templateUrl: './spotlight-listing.page.html',
  styleUrls: ['./spotlight-listing.page.scss'],
})
export class SpotlightListingPage implements OnInit {

  headerConfig = {
    title:"SPOTLIGHTS",
    showBackButton: true
  }
  spotlightStories:any[]=[];
  page=1;
  limit=10;
  count=0;
  disableLoading: boolean = false
  pageConfig:any = {}
  profilePayload:any = {}

  constructor(private profileService: ProfileService, private loaderService: LoaderService,private projectsApiService: ProjectsApiService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getProfileDetails();

  }

  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
      if (mappedIds) {
        this.profilePayload = mappedIds;
        this.getData();
      }
    });
  }

  async getData($event?:any){
    await this.loaderService.showLoading("LOADER_MSG")
    let url = `${urlConfig.project.spotlightUrl}&page=${this.page}&limit=${this.limit}&search=&filter=`;
    this.projectsApiService.get(url).subscribe({
      next: async(response: any)=>{
        await this.loaderService.dismissLoading()
        if(response.status == 200){
          this.spotlightStories = this.spotlightStories.concat(response.result.data);
          this.count = response.result.count;
          this.disableLoading = !this.spotlightStories.length || this.spotlightStories.length == response.result.count;
        }
        else {
          this.toastService.presentToast(response.message, 'danger')
        }
        if($event){
          $event.target.complete()
        }
      },
      error: async(error: any)=>{
        await this.loaderService.dismissLoading();
        this.toastService.presentToast(error.error.message, 'danger')
      }
    })
  }

  loadData($event:any){
    this.page +=1;
    this.getData($event);
  }

}
