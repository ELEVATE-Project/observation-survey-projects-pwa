import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastService } from '../services/toast/toast.service';
import { LoaderService } from '../services/loader/loader.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { finalize } from 'rxjs';
import { UrlConfig } from 'src/app/interfaces/main.interface';
import urlConfig from 'src/app/config/url.config.json';
import { actions } from '../config/actionContants';
import { ProfileService } from '../services/profile/profile.service';

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
  programFilters=actions.PROGRAM_FILTERS;
  programFilter:any = "all";
  programList:any=[];
  entityData:any;
  programData:any;
  filteredList: any;
  filterData:any;
 
  constructor(private route : ActivatedRoute,
    private navCtrl: NavController,
    private toastService :ToastService, 
    private loader : LoaderService,
    private ProjectsApiService: ProjectsApiService,
    private router: Router,
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
    this.filteredList=[]
    this.filterData = []
  }
  goBack() {
    this.navCtrl.back();
  }

  filterChanged(event:any){
    this.programFilter = event.detail.value;
    this.applyFilter();
  }

  toggleReadMore() {
    this.showMore = !this.showMore;
  }

  selectSection(data:any){

    this.filterData.forEach((element:any) => {
      if(data.sectionName == element.sectionName){
        data.show = ! data.show;
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
    this.filterData=this.programList.sort((a:any,b:any)=>{return a.order - b.order}).map((item:any)=>({ ...item,show:true}))
  }

  get descriptionText(): string {
    if (!this.programData || !this.programData.description) return '';
    return this.showMore || this.programData.description.length <= this.characterLimit 
      ? this.programData.description 
      : this.programData.description.slice(0, this.characterLimit) + '....';
  }

  applyFilter(){
    if (this.programFilter === 'all') {
      this.filteredList =  this.filterData.map((item: any) => ({...item,show: false}))
    } else { 
      this.filteredList = this.filterData.filter((item: any) => item.sectionName === this.programFilter)
                          .map((item: any) => ({ ...item, show: true }));
    }
  }

  navigateTo(data:any){
    
    switch (data.type) {
      case 'improvementProject':
        this.router.navigate(['project-details'], { state: { _id:data.projectId || null, solutionId: data._id} });
        break;
  
      case 'survey':
        this.router.navigate(['questionnaire', data.solutionId]);
        break;

      default:
        console.warn('Unknown listType:', data.type);
    }
  }
  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
      if (mappedIds) {
      this.entityData=mappedIds
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
        this.formatList()
        this.applyFilter();
      } else {
        this.toastService.presentToast(res?.message, 'danger');
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }  
}