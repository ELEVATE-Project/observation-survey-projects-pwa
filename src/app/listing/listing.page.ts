import { Component, inject, OnInit } from '@angular/core';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { actions } from 'src/app/config/actionContants';
import { ProfileService } from '../services/profile/profile.service';
import { AlertService } from '../services/alert/alert.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { SamikshaApiService } from '../services/samiksha-api/samiksha-api.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  solutionList: any = { data: [], count: 0 };
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
  entityData:any;
  ProjectsApiService: ProjectsApiService;
  SamikshaApiService:SamikshaApiService;
  showLoading:boolean = true;
  reportPage:boolean = false

  constructor(private navCtrl: NavController, private router: Router,
    private profileService: ProfileService,
    private alertService: AlertService, private activatedRoute: ActivatedRoute
  ) {
    this.ProjectsApiService = inject(ProjectsApiService);
    this.SamikshaApiService = inject(SamikshaApiService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
    activatedRoute.queryParams.subscribe((params:any)=>{
      this.listType = params["type"]
      this.reportPage = params["reportPage"] == "true"
    })
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.page = 1;
    this.solutionList = { data: [], count: 0 }
    this.stateData = await this.profileService.getHomeConfig(this.listType)
    this.getProfileDetails();
    this.showLoading = true;
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
    this.showLoading = true;
    await this.loader.showLoading("Please wait while loading...");
    if(this.listType !== 'project'){
      this.filter = '';
    };
    (this.listType == 'project' ? this.ProjectsApiService : this.SamikshaApiService)
      .post(
        urlConfig[this.listType].listingUrl + `?type=${this.stateData.solutionType}&page=${this.page}&limit=${this.limit}&filter=${this.filter}&search=${this.searchTerm}${this.stateData.reportIdentifier ? `&` +this.stateData.reportIdentifier+`=`+this.reportPage : ''}`, this.entityData)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
          this.showLoading = false;
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

  navigateTo(data: any) {
    if(this.listType == 'project'){
      this.router.navigate(['project-details'], { state: { _id:data._id || null, solutionId: data.solutionId} });
    }else if(this.listType == 'survey'){
      this.router.navigate(['questionnaire',data.solutionId])
    }else{
      this.router.navigate(['report-details'])
    }
  }
}