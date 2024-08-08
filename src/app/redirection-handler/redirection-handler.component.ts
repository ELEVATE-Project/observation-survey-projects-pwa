import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBaseService } from '../services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json'
import { UtilService } from '../services/util/util.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';

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
  profileInfo:any = {
    "entityType" : "block",
    "entityTypeId" : "5f32d8228e0dc8312404056e",
    "entities" : [
        "5fd1b52ab53a6416aaeefc80",
        "5fd098e2e049735a86b748ac",
        "5fd1b52ab53a6416aaeefc83",
        "5fd1b52ab53a6416aaeefb20"
    ],
    "role" : "BEO,HM"
  }
  toastService: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private navCtrl: NavController) {
    this.apiService = inject(ApiBaseService)
    this.utils = inject(UtilService)
    this.toastService = inject(ToastService)
    activatedRoute.paramMap.subscribe((param:any)=>{
      this.type = param.get("type")
      this.linkId = param.get("id")
      this.checkLinkType()
    })
  }

  ngOnInit() {
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