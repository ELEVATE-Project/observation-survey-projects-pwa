import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import  urlConfig  from 'src/app/config/url.config.json';
import { UtilService } from 'src/app/services/util/util.service';
import { EvidencePreviewCardComponent } from '../shared/evidence-preview-card/evidence-preview-card.component';
import { PopoverController } from '@ionic/angular';

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
  dots: number[] = [];
  constructor(private router: Router,
    private popoverController:PopoverController,
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
  async previewResource(item: any) {
    const popover = await this.popoverController.create({
      component: EvidencePreviewCardComponent,
      componentProps: {
        type: item.isType,
        name: item.title,
        url: item.downloadableUrl,
      },
      cssClass: 'resource-preview-popover',
      backdropDismiss: true,
    });
    await popover.present();
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
          isType: this.utilService.isFileType(item.type),
        }));
        this.saved=res.result.wishlist
        this.headerConfig.customActions = [{ icon: this.saved ? 'bookmark' : 'bookmark-outline', actionName: 'save' }];
        this.getDots();
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

  getDots():any {
    const length = this.projectDetails?.testimonials?.length || 0;
  if (length === 2) {
    this.dots = Array(2).fill(0);
  } else if (length >= 3) {
    this.dots = Array(3).fill(0);
  } else {
    this.dots = [];
  }
}
}
