import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { ToastService } from '../services/toast/toast.service';
import { LoaderService } from '../services/loader/loader.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { finalize } from 'rxjs';
import urlConfig from 'src/app/config/url.config.json';
// import { actions } from '../config/actionContants';
import { ProfileService } from '../services/profile/profile.service';
import { PopUpComponent } from '../shared/pop-up/pop-up.component';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.page.html',
  styleUrls: ['./program-details.page.scss'],
})
export class ProgramDetailsPage implements OnInit {
  programId:any;
  showLoading:boolean = true;
  characterLimit = 150;
  showMore:boolean=false
  // programFilters=actions.PROGRAM_FILTERS;
  // programFilter:any = "all";
  programList:any=[];
  entityData:any;
  programData:any;
  filteredList: any;
  filterData:any;
  programDescription: any;
 
  constructor(private route : ActivatedRoute,
    private navCtrl: NavController,
    private toastService :ToastService, 
    private loader : LoaderService,
    private ProjectsApiService: ProjectsApiService,
    private router: Router,
    private popoverController: PopoverController,
    private profileService: ProfileService) {

    this.route.params.subscribe(param=>{
      this.programId = param['id'];
    })

 }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getProfileDetails()
  }
  ionViewWillLeave(){
    this.programList=[]
    // this.filteredList=[]
    this.filterData = []
  }

  // filterChanged(event:any){
  //   this.programFilter = event.detail.value;
  //   this.applyFilter();
  // }

  toggleReadMore() {
    this.showMore = !this.showMore;
    this.formatDescription()
  }

  selectSection(data:any){

    this.filterData.forEach((element:any) => {
      if(data.sectionName == element.sectionName){
        data.show = !data.show;
      }else{
        element.show =false;
      }
    });

  }

  formatList(){
    this.filterData=this.programData.data;
    this.filterData.forEach((data:any)=>{
      let sectionName=data.type=='improvementProject'?'projects':data.type+'s'
      let index = this.programList.findIndex((val:any)=>{return val.sectionName==sectionName})
      if(index!==-1){
        this.programList[index].sectionList.push(data)
       }else{
        let order=data.type=='improvementProject'?0:data.type=='observation'?1:2
        this.programList.push({sectionName:sectionName,sectionList:[data],order:order})
       }
    })
    this.filterData=this.programList.sort((a:any,b:any)=> a.order - b.order).map((item:any) => ({ ...item,show: false }))
  }

  formatDescription() {
    if (!this.programData || !this.programData.description) {
      this.programDescription = '';
    } else if (this.showMore || this.programData.description.length <= this.characterLimit) {
      this.programDescription = this.programData.description;
    } else {
      this.programDescription = this.programData.description.slice(0, this.characterLimit) + '....';
    }
  }

  // applyFilter(){
  //   if (this.programFilter === 'all') {
  //     this.filteredList =  this.filterData.map((item: any) => ({...item,show: false}))
  //   } else { 
  //     this.filteredList = this.filterData.filter((item: any) => item.sectionName === this.programFilter)
  //                         .map((item: any) => ({ ...item, show: true }));
  //   }
  // }

  navigateTo(data:any){
    
    switch (data.type) {
      case 'improvementProject':
        this.router.navigate(['project-details'], { state: { _id:data.projectId || null, solutionId: data._id} });
        break;
  
      case 'survey':
        this.redirectSurvey(data);
        break;

      case 'observation':
        window.location.href = `/managed-observation-portal/entityList/${data._id}/${data.name}/${data.entityType}/${data._id}`
        break;

      default:
        console.warn('Unknown listType:', data.type);
    }
  }
  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe(async(mappedIds) => {
      if (mappedIds) {
      this.entityData= await mappedIds
      this.getProgramDetails()
      }
    });
  }
  async getProgramDetails(){
    this.showLoading = true;
    await this.loader.showLoading("LOADER_MSG");
    this.ProjectsApiService.post(
      urlConfig['program'].detailsUrl+`/${this.programId}`,this.entityData
    ).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
        this.showLoading = false;
      })
    ).subscribe((res:any)=>{
      if (res?.status == 200) {
        this.programData=res.result;
        this.formatList();
        this.formatDescription();
        // this.applyFilter();
      } else {
        this.toastService.presentToast(res?.message, 'danger');
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }  

  redirectSurvey(data: any) {
    this.ProjectsApiService.post(
      urlConfig['survey'].detailsUrl + `${data._id}`,
      this.entityData
    ).subscribe(
      (res: any) => {
        if (res?.status === 200) {
          const status = res.result?.assesment?.status;

          if (status === 'expired') {
            this.openPopup('expired');
          } else if (status === 'completed') {
            this.openPopup('completed');
          } else {
            window.location.href = `/managed-observation-portal/questionnaire?index=0&submissionId=${data.submissionId}&solutionId=${data._id}`;
          }
        } else {
          this.toastService.presentToast(res?.message, 'danger');
        }
      },
      (err: any) => {
        this.toastService.presentToast(err?.error?.message, 'danger');
      }
    );
  }

  async openPopup(type:any){
    const popup = await this.popoverController.create({
      component: PopUpComponent,
      componentProps:{
        data:{
          showCancel:false,
          message: type == 'completed' ? 'SURVEY_COMPLETED' : 'SURVEY_EXPIRED',
          button:{text:"OK"}
        }
      },
      cssClass: 'popup-class3',
      backdropDismiss: true
    });
    await popup.present();
    popup.onDidDismiss().then((data)=>{
          return data.data;
          })
  }

}