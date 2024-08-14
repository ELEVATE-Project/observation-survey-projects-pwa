import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBaseService } from '../services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json'
import { UtilService } from '../services/util/util.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { ProfileService } from '../services/profile/profile.service';

@Component({
  selector: 'app-redirection-handler',
  templateUrl: './redirection-handler.component.html',
  styleUrls: ['./redirection-handler.component.scss'],
})
export class RedirectionHandlerComponent  implements OnInit {
  type:any = ''
  linkId:any = ''
  apiService:any
  utils:any
  profileInfo:any = {}
  toastService: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private navCtrl: NavController, private profileService: ProfileService) {
    this.apiService = inject(ApiBaseService)
    this.utils = inject(UtilService)
    this.toastService = inject(ToastService)
    activatedRoute.paramMap.subscribe((param:any)=>{
      this.type = param.get("type")
      this.linkId = param.get("id")
      this.getProfileDetails()
    })
  }

  ngOnInit() {
  }

  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
      if (mappedIds) {
        this.profileInfo = mappedIds;
        this.checkLinkType()
      }
    });
  }

  checkLinkType(){
    switch (this.type) {
      case "project":
        this.verifyLink()
        break;
    
      default:
        break;
    }
  }

  async verifyLink(){
    if(!this.utils.isLoggedIn()){
      this.router.navigate(['project-details'], { state: { link: this.linkId, referenceFrom: "link" }, replaceUrl:true });
      return
    }
    this.apiService.post(urlConfig.project.verifyLink+this.linkId+"?createProject=false",this.profileInfo).subscribe((response:any)=>{
      if(response && response.result){
        switch (response.result.type) {
          case "improvementProject":
            this.router.navigate(['/home'],{ replaceUrl:true })
            setTimeout(() => {
              this.router.navigate(['project-details'], { state: { ...response.result, referenceFrom: "link" } });
            }, 100);
            break;
        
          default:
            break;
        }
      }else{
        this.navCtrl.back()
      }
    },(error:any)=>{
      this.toastService.presentToast("Invalid Link, please try with other link","danger")
      this.router.navigate(['/home'],{ replaceUrl:true })
    })
  }

}