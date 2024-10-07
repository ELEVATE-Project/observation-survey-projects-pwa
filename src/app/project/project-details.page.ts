import {  Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../services/profile/profile.service';
import { UtilService } from '../services/util/util.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard'
import { ToastService } from '../services/toast/toast.service';
import { ShareLinkPopupComponent } from '../shared/share-link-popup/share-link-popupcomponent';
import { NetworkServiceService } from 'network-service';

@Component({
  selector: 'app-project',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss']
})
export class ProjectDetailsPage  implements OnInit {
  router: Router;
  projectData:any;
  isOnline:any;
  config = {
    maxFileSize: 50,
    baseUrl: environment.projectsBaseURL,
    accessToken: localStorage.getItem('accToken'),
    profileInfo: {}
  }
  showDetails = false
  sharePopupHandler:any
    constructor(private navCtrl: NavController, private profileService: ProfileService, private utils: UtilService,private toastService:ToastService,private popoverController:PopoverController,private network:NetworkServiceService) {
      this.router = inject(Router);
      this.network.isOnline$.subscribe((status: any)=>{
        this.isOnline=status
      })
      if(this.isOnline){
      this.getProfileDetails()
      }
      else{
        this.showDetails = true
      }
    }

    ngOnInit(): void {
      this.sharePopupHandler = this.handleMessage.bind(this);
      window.addEventListener('message', this.sharePopupHandler);
      this.projectData = this.router.getCurrentNavigation()?.extras.state;
    }

    async handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === 'SHARE_LINK') {
        const url = event.data.url;
      if (this.utils.isMobile()) {
        try {
          const shareOptions = {
            title: 'Project Report',
            text: 'Check out this project report',
            url: url,
          };
          await Share.share(shareOptions);
        } catch (err) {
        }
      } else {
        this.setOpenForCopyLink(url);
        }
      }
    }

    async setOpenForCopyLink(value:any) {
      const popover = await this.popoverController.create({
       component: ShareLinkPopupComponent,
       componentProps: {
         data: {
           downloadUrl: value,
         },
       },
       cssClass: 'popup-class',
       backdropDismiss: true,
     });String
     await popover.present();
     popover.onDidDismiss().then((data) => {
      if (data.data) {
        Clipboard.write({ string: value });
        this.toastService.presentToast('LINK_COPY_SUCCESS', 'success');
      }
    });
   }


    goBack(){
      this.navCtrl.back();
    }

    getProfileDetails() {
      if(!this.utils.isLoggedIn()){
        this.showDetails = true
        return
      }
      this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
        if (mappedIds) {
          this.config.profileInfo = mappedIds;
        }else{
          history.replaceState(null, '','/');
          this.navCtrl.back()
        }
        this.showDetails = true
      });
    }

    ngOnDestroy() {
      window.removeEventListener('message', this.sharePopupHandler);
    }

}
