import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from 'src/app/services/toast/toast.service';

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
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private profileService: ProfileService,
    private loaderService: LoaderService,
    private projectsApiService: ProjectsApiService,
    private toastService: ToastService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.programName = navigation?.extras.state?.['data'];
    this.route.params.subscribe(param=>{
      this.programId = param['id'];
  })
  }

  myJourneyInprogress :any[]=[];
  myJourneyCompleted: any[]=[];
  inProgressPage = 1;
  inProgressLimit = 15;
  inProgressCount = 0;
  completedPage = 1;
  completedLimit = 15;
  completedCount = 0;
  disableLoading: boolean = false;
  pageConfig: any = {};
  profilePayload: any = {};
  selectedSegment: string = 'inProgress';

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    this.myJourneyInprogress=[];
    this.myJourneyCompleted=[];
    this.inProgressPage = 1;
    this.inProgressLimit = 15;
    this.inProgressCount = 0;
    this.completedPage = 1;
    this.completedLimit = 15;
    this.completedCount = 0;
    this.getProjects(this.selectedSegment)

  }

  ionViewWillEnter(){
    this.getProfileDetails();
  }

  getProfileDetails() {
    this.profileService
      .getProfileAndEntityConfigData()
      .subscribe((mappedIds) => {
        if (mappedIds) {
          this.profilePayload = mappedIds;
          this.getProjects('inProgress');
        }
      });
  }

  async getProjects(status:any, $event?: any) {
    await this.loaderService.showLoading('LOADER_MSG');
    const isInProgress = status === 'inProgress';

    const page = isInProgress ? this.inProgressPage : this.completedPage;
    const limit = isInProgress ? this.completedLimit : this.inProgressLimit;

    const url = `${urlConfig.project.myImprovementsUrl}?&page=${page}&limit=${limit}&search=&status=${status}&programId=${this.programId}`;

    this.projectsApiService.post(url, {}).subscribe({
      next: async (response: any) => {
        await this.loaderService.dismissLoading();
        if (response.status == 200) {
          if (isInProgress) {
            this.myJourneyInprogress = this.myJourneyInprogress.concat(response.result.data);
            this.inProgressCount = response.result.count;
            this.disableLoading =
              !this.myJourneyInprogress.length ||
              this.myJourneyInprogress.length === response.result.count;
          } else {
            this.myJourneyCompleted = this.myJourneyCompleted.concat(response.result.data);
            this.completedCount = response.result.count;
            this.disableLoading =
              !this.myJourneyCompleted.length ||
              this.myJourneyCompleted.length === response.result.count;
          }
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

  calculateProgress(item:any): any {
    let completedCount = item?.taskReport?.completed || 0;
    const totalTasks = item?.taskReport?.total ?? 0;

    if (totalTasks === 0) {
      return 0;
    }

    if (completedCount === totalTasks) {
      return item?.isreflected ? 100 : 99;
    } else {
      return Math.round((completedCount / totalTasks) * 100);
    }
  }

  navigateproject(id:any){
    this.router.navigate(['project-details'], { state: { _id: id } });
  }

  ionViewWillLeave(){
    this.myJourneyInprogress=[];
    this.myJourneyCompleted=[];
    this.inProgressPage = 1;
    this.inProgressLimit = 15;
    this.inProgressCount = 0;
    this.completedPage = 1;
    this.completedLimit = 15;
    this.completedCount = 0;
  }

  loadOngoingData(event:any){
    this.inProgressPage += 1;
    this.getProjects('inProgress',event);
  }

  loadCompletedData(event:any){
    this.completedPage += 1;
    this.getProjects('completed',event);
  }
}
