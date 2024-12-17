import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from 'src/app/services/toast/toast.service';
import { actions } from 'src/app/config/actionContants';

@Component({
  selector: 'app-my-journey',
  templateUrl: './my-journey.page.html',
  styleUrls: ['./my-journey.page.scss'],
})
export class MyJourneyPage  {
  headerConfig={
    title:"MY_JOURNEY",
    showBackButton: true,
  }
  programId:any;
  programName:any;
  filterActions: any;
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private loaderService: LoaderService,
    private projectsApiService: ProjectsApiService,
    private toastService: ToastService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.route.params.subscribe(param=>{
      this.programId = param['id'];
  })
  this.filterActions = actions.JOURNEY_FILTERS;
  }

  myJourneyInprogress :any[]=[];
  myJourneyCompleted: any[]=[];
  page = 1;
  limit = 15;
  disableLoading: boolean = false;
  pageConfig: any = {};
  profilePayload: any = {};
  selectedSegment: string = "";

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    this.myJourneyInprogress=[];
    this.myJourneyCompleted=[];
    this.page = 1;
    this.limit = 15;
    this.getProjects();

  }

  ionViewWillEnter(){
    this.selectedSegment = this.filterActions.inProgress;
    this.getProjects();
  }

  async getProjects($event?: any) {
    await this.loaderService.showLoading('LOADER_MSG');
    const isInProgress = this.selectedSegment === this.filterActions.inProgress;

    const url = `${urlConfig.project.myImprovementsUrl}?&page=${this.page}&limit=${this.limit}&search=&status=${this.selectedSegment}&programId=${this.programId}`;
    this.projectsApiService.post(url, {}).subscribe({
      next: async (response: any) => {
        await this.loaderService.dismissLoading();
        if (response.status == 200) {
          this.programName = response.result.programName;
          this.updateJourneyData(response.result.data, response.result.count, isInProgress);
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

  private updateJourneyData(data: any[], count: number, isInProgress: boolean): void {
    const journey = isInProgress ? 'myJourneyInprogress' : 'myJourneyCompleted';
    this[journey] = this[journey].concat(data);
    this.disableLoading = !this[journey].length || this[journey].length === count;
  }

  ionViewWillLeave(){
    this.myJourneyInprogress=[];
    this.myJourneyCompleted=[];
    this.page = 1;
    this.limit = 15;
  }

  loadData(event:any){
    this.page += 1;
    this.getProjects(event);
  }
}