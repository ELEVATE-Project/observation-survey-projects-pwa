import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import  urlConfig  from 'src/app/config/url.config.json';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-mi-details',
  templateUrl: './mi-details.page.html',
  styleUrls: ['./mi-details.page.scss'],
})
export class MiDetailsPage implements OnInit {
  headerConfig: any = {
    showBackButton:true,
    customActions: [{ icon: 'bookmark-outline', actionName: 'save' }]
  };
  projectId:any;
  showLoading:boolean = true;
  saved:boolean=false;
  projectDetails:any;
  constructor(private router: Router,
    private route : ActivatedRoute,
    private toastService :ToastService,
    private loader : LoaderService,
    private ProjectsApiService: ProjectsApiService,
    private utilService:UtilService
  ) {
    this.route.params.subscribe(param=>{
        this.projectId = param['id'];
    })
   }

  ngOnInit() {
    this.getProjectDetails()
  }

  saveClick(event:any){
    this.handleSaved(this.saved ? 'remove' : 'add')
  }

  async handleSaved(actionType: 'add' | 'remove'){
    const url = actionType === 'add' ? urlConfig['save'].saveAdd : urlConfig['save'].saveRemove;
    this.showLoading = true;
    await this.loader.showLoading("LOADER_MSG");
    this.ProjectsApiService.post(url+`/${this.projectId}`,{}).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
        this.showLoading = false;
      })
    ).subscribe((res:any)=>{
      if (res?.status == 200) {
        this.saved = actionType === 'add';
        this.headerConfig.customActions = [{ icon: this.saved ? 'bookmark' : 'bookmark-outline', actionName: 'save' }];
        this.toastService.presentToast(res.message, 'success');
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }


  async getProjectDetails(){
    this.showLoading = true;
    await this.loader.showLoading("LOADER_MSG");
    this.ProjectsApiService.get(urlConfig['miDetail'].miDetailUrl+`${this.projectId}?`).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
        this.showLoading = false;
      })
    ).subscribe((res:any)=>{
      if (res?.status == 200) {
        this.projectDetails=res.result
        this.projectDetails.evidences = this.projectDetails.evidences.map((item: any) => ({
          ...item,
          isImage: this.utilService.isFileType(item.type, 'images'),
        }));
        this.saved=res.result.wishlist
        this.headerConfig.customActions = [{ icon: this.saved ? 'bookmark' : 'bookmark-outline', actionName: 'save' }];
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }

  starImprovement(){
    this.router.navigate(['/mi-details/add-problem-statement',this.projectId]);
  }
}
