import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { ProfileService } from '../services/profile/profile.service';
import { ToastService } from '../services/toast/toast.service';
import { LoaderService } from '../services/loader/loader.service';
import { IonSearchbar, MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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
  searchTerm:string = ""
  headerConfig:any;
  resultMsg: any;
  isMenuOpen = true
  filterQuery = ""

  searchBar = true
  constructor(private activatedRoute: ActivatedRoute,private profileService: ProfileService, private projectsApiService: ProjectsApiService,
    private toastService: ToastService, private loaderService: LoaderService, private translate:TranslateService, private menuControl: MenuController
  ) {
    activatedRoute.data.subscribe((data:any)=>{
      this.pageConfig = structuredClone(data);
    })
  }


  ngOnInit() {
    this.setHeaderConfig()
  }

  setHeaderConfig(){
      this.headerConfig = structuredClone(this.pageConfig.headerConfig)
  }

  ionViewWillEnter(){
    this.searchBar = true;
    this.reset();
    this.isMenuOpen = true
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
    let url = `${this.pageConfig.apiUrl}&page=${this.page}&limit=${this.limit}&searchText=${this.searchTerm}${this.filterQuery}`
    this.projectsApiService.get(url).subscribe({
      next: async(response: any)=>{
      await this.loaderService.dismissLoading()
      if(response.status == 200){
        this.listingData = this.listingData.concat(response.result.data)
        this.count = response.result.count
        this.disableLoading = !this.listingData.length || this.listingData.length == response.result.count;
        let translateKey = this.count > 1 ? 'SEARCH_RESULTS' : 'SEARCH_RESULT'
        if(this.pageConfig.enableSearch){
          this.translate
          .get(translateKey, { count: this.count, searchterm:this.searchTerm })
          .subscribe((translatedTitle) => {
            this.resultMsg = translatedTitle
        })
        }
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

  handleActionClick(event?:any){
    this.isMenuOpen = true
    this.menuControl.open()
  }

  loadData($event: any){
    this.page +=1
    this.getData($event)
  }

  reset(){
    this.searchTerm = ''
    this.page = 1
    this.listingData = []
    this.count = 0
  }

  handleInput(event: any) {
    this.searchTerm = event.target.value;
    this.reset();
    this.getData();
  }

  showFilter(){
    this.isMenuOpen = true
    this.menuControl.open()
  }

  filterEvent($event:any){
    this.filterQuery = Object.entries($event).map(([key, value]) => `&${key}=${value}`).join('')
    this.reset()
    this.getData()
  }

  ionViewWillLeave(){
    this.searchBar = false;
    this.isMenuOpen = false
    this.menuControl.close() 
    this.reset()
    this.searchTerm = ""
    this.filterQuery = ""
  }
}