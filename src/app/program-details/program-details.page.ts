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

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.page.html',
  styleUrls: ['./program-details.page.scss'],
})
export class ProgramDetailsPage implements OnInit {
  solutionId:any;
  showLoading:boolean = true;
  listType:keyof UrlConfig = "program";
  characterLimit = 150;
  showMore:boolean=false
  programfilters=actions.PROGRAM_FILTERS;
  Programfilter:any = "all";
  solutionsList:any=[];
  data:any;
  filteredData: any;
  fliterData:any;
  constructor(private route : ActivatedRoute,private navCtrl: NavController,private toastService :ToastService, private loader : LoaderService,private ProjectsApiService: ProjectsApiService,private router: Router) {
    this.route.params.subscribe(param=>{
      this.solutionId = param['id'];
    })
 }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.fliterData=this.data.result.data
    this.getProgramDetails()
    this.formatList()
    this.applyFilter();
  }
  ionViewWillLeave(){
    this.solutionsList=[]
    this.filteredData=[]
    this.fliterData = []
  }
  goBack() {
    this.navCtrl.back();
  }
  filterChanged(event:any){
    this.Programfilter = event.detail.value;
    this.applyFilter();
  }
  toggleReadMore() {
    this.showMore = !this.showMore;
  }

  selectSection(data:any){
    this.fliterData.forEach((element:any) => {
      if(data.sectionName == element.sectionName){
        data.show = ! data.show;
      }else{
        element.show =false;
      }
    });
  }

  formatList(){
    this.fliterData.forEach((data:any)=>{
      let sectionName=data.type=='improvementProject'?'projects':data.type+'s'
      let index = this.solutionsList.findIndex((val:any)=>{return val.sectionName==sectionName})
      if(index!==-1){
        this.solutionsList[index].sectionList.push(data)
       }else{
        let order=data.type=='improvementProject'?0:data.type=='observation'?1:2
        this.solutionsList.push({sectionName:sectionName,sectionList:[data],order:order})
       }
    })
    this.fliterData=this.solutionsList.sort((a:any,b:any)=>{return a.order - b.order}).map((item:any)=>({ ...item,show:true}))
  }

  applyFilter(){
    if (this.Programfilter === 'all') {
      this.filteredData =  this.fliterData.map((item: any) => ({...item,show: false}))
    } else { 
      this.filteredData = this.fliterData.filter((item: any) => item.sectionName === this.Programfilter).map((item: any) => ({ ...item, show: true }));
  }
  }

  navigateTo(data:any){
    switch (data.type) {
      case 'improvementProject':
        this.router.navigate(['project-details'], { state: { _id:data._id || null, solutionId: data.solutionId} });
        break;
  
      case 'survey':
        this.router.navigate(['questionnaire', data.solutionId]);
        break;

      default:
        console.warn('Unknown listType:', data.type);
    }
  }
  async getProgramDetails(){
    this.showLoading = true;
    await this.loader.showLoading("Please wait while loading...");
    this.ProjectsApiService.get(
      urlConfig['program'].detailsUrl+`/${this.solutionId}`
    ).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
        this.showLoading = false;
      })
    ).subscribe((res:any)=>{
      console.log(res,"in program new")
      if (res?.status == 200) {
      } else {
        this.toastService.presentToast(res?.message, 'warning');
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }  
}