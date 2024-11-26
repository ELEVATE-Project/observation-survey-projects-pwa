import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { ProfileService } from '../services/profile/profile.service';
import { ToastService } from '../services/toast/toast.service';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'app-generic-listing-page',
  templateUrl: './generic-listing-page.component.html',
  styleUrls: ['./generic-listing-page.component.scss'],
})
export class GenericListingPageComponent  implements OnInit {
  listingData: any = []
  page = 1
  limit = 10
  count = 0
  disableLoading: boolean = false
  pageConfig:any = {}
  profilePayload:any = {}
  search:string = ""

  constructor(private activatedRoute: ActivatedRoute,private profileService: ProfileService, private projectsApiService: ProjectsApiService,
    private toastService: ToastService, private loaderService: LoaderService
  ) {
    activatedRoute.data.subscribe((data:any)=>{
      this.pageConfig = data
    })
  }

  ngOnInit() {
    this.getProfileDetails()
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
    let url = `${this.pageConfig.apiUrl}?page=${this.page}&limit=${this.limit}&search=${this.search}`
    this.projectsApiService.get(url).subscribe({
      next: async(response: any)=>{
      await this.loaderService.dismissLoading()
      if(response.status == 200){
        this.listingData = this.listingData.concat(response.result.data)
        this.count = response.result.count
        this.disableLoading = !this.listingData.length || this.listingData.length == response.result.count
      }else{
        this.toastService.presentToast(response.message, 'danger')
      }
      if($event){
        $event.target.complete()
      }
      },
      error: async(error:any)=>{
        await this.loaderService.dismissLoading()
        this.toastService.presentToast(error.error.message, 'danger')
      }
    })
  }

  loadData($event: any){
    this.page +=1
    this.getData($event)
  }

  reset(){
    this.page = 1
    this.listingData = []
    this.count = 0
  }

}