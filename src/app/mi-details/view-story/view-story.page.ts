import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import  urlConfig  from 'src/app/config/url.config.json';
import { UtilService } from '../../services/util/util.service';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ShareLinkComponent } from '../../shared/share-link/share-link.component';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { actions } from 'src/app/config/actionContants';
import { Resource } from 'src/app/interfaces/viewresource';

@Component({
  selector: 'app-view-story',
  templateUrl: './view-story.page.html',
  styleUrls: ['./view-story.page.scss'],
})
export class ViewStoryPage implements OnInit {
  headerConfig:any={
    showBackButton:true
  }
  projectId:any;
  attachments:any
  resource:Resource={ images: [], videos: [], documents: [] };
  viewProjectDetails:any;
  storyDetails:any;
  constructor(
    private toastService :ToastService,
    private loader : LoaderService,
    private projectsApiService: ProjectsApiService,
    private utilService:UtilService,
    private popoverController:PopoverController,
    private route:ActivatedRoute
  ) { 
    this.route.params.subscribe(param=>{
      this.projectId = param['id'];
  })
  }

  ngOnInit() {
    this.getProjectDetails()
  }

  async copyText() {
    if (this.storyDetails?.summary) {
      try {
        await Clipboard.write({
          string: this.storyDetails.summary,
        });
        this.toastService.presentToast('TEXT_COPY_SUCCESS', 'success');
      } catch (err:any) {
        this.toastService.presentToast(err?.message, 'danger');
      }
    }
  }

  async share(){
    if (this.utilService.isMobile()) {
      try {
        const shareOptions = {
          title: this.storyDetails.title,
          url: this.storyDetails.pdfInformation[0].sharableUrl,
        };
        await Share.share(shareOptions);
      } catch (err:any) {
        this.toastService.presentToast(err?.message, 'danger');
      }
    }else {
      this.setOpenForCopyLink(this.storyDetails.pdfInformation[0].sharableUrl);
    }
    
  }

async setOpenForCopyLink(url:any){
  const popover = await this.popoverController.create({
    component: ShareLinkComponent,
    componentProps: {
      data: {
        downloadUrl: url,
      },
    },
    cssClass: 'popup-class',
    backdropDismiss: true,
  });String
  await popover.present();
  popover.onDidDismiss().then((data:any) => {
   if (data.data) {
     Clipboard.write({string:url});
     this.toastService.presentToast('LINK_COPY_SUCCESS', 'success');
   }
 });
}

  download(){
    fetch(this.viewProjectDetails.story.pdfInformation[0].url)
    .then((resp) => resp.blob())
    .then((blob) => {  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.viewProjectDetails.title}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.toastService.presentToast('DOWNLOADED_SUCCESSFULLY', 'success');
    })
    .catch((err) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    });
  }

  async getProjectDetails(){
    await this.loader.showLoading("LOADER_MSG");
    this.projectsApiService.post(urlConfig['miDetail'].viewDetailUrl+`${this.projectId}`,{}).pipe(
      finalize(async ()=>{
        await this.loader.dismissLoading();
      })
    ).subscribe(async (res:any)=>{
      if (res?.status == 200) {
        this.viewProjectDetails=res.result;
        this.storyDetails=this.viewProjectDetails.story;
        this.attachments = this.viewProjectDetails.attachments.map((item:any)=>{
            return {
              ...item,
              type:this.fileExtension(item.type)
            }
        })
        await this.filterAndSeparateFiles(this.attachments)
      }
    },
    (err: any) => {
      this.toastService.presentToast(err?.error?.message, 'danger');
    }
  )
  }
  
fileExtension(type: string): string {
    const extension = type.split('/')[1];
    return extension;
}

filterAndSeparateFiles(files:any) {
  if(files.length == 0){
    return ;
  }
  const regexPatterns:any = actions.REGEX_MAP
  files.forEach((file:any) => {
      const fileType = file.type.toLowerCase();
      const category:keyof Resource= Object.keys(regexPatterns).find((key:any) => 
        regexPatterns[key].test(fileType)
      ) as keyof Resource;
      if (category && this.resource[category]) {
        this.resource[category].push(file);
      }
    });
  }
  
}
