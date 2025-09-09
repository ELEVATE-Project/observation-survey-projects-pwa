import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import urlConfig from 'src/app/config/url.config.json'
import { UtilService } from '../services/util/util.service';
import { ToastService } from '../services/toast/toast.service';
import { NavController } from '@ionic/angular';
import { ProfileService } from '../services/profile/profile.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import { NetworkServiceService } from 'network-service';

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
  isOnline:any;
  permittedUsers = ["administrator", "teacher"]

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private navCtrl: NavController, private profileService: ProfileService,private network:NetworkServiceService) {
    this.apiService = inject(ProjectsApiService)
    this.utils = inject(UtilService)
    this.toastService = inject(ToastService)
    this.network.isOnline$.subscribe((status: any)=>{
      this.isOnline=status
    })
    activatedRoute.paramMap.subscribe((param:any)=>{
      this.type = param.get("type")
      this.linkId = param.get("id")
      if(!this.isOnline){
        this.toastService.presentToast('NETWORK_OFFLINE','danger')
        return
      }
      setTimeout(() => {
        if(!this.utils.isLoggedIn()){
          this.checkLinkType()
        }else{
          this.getProfileDetails()
        }
      }, 2000);
    })
  }

  ngOnInit() {
  }

  getProfileDetails() {
    this.profileService.getProfileAndEntityConfigData().subscribe(async(mappedIds) => {
      let data = await mappedIds
      if (data) {
        this.profileInfo = data;
        this.checkLinkType()
      }
      // else{
        // this.router.navigate(['/home'],{ replaceUrl:true })
        // console.log("ELSE block in profile fetch")
        // const options = {
        //   type:"redirect",
        //   pathType:"home"
        // };
        // let response = await this.utils.postMessageListener(options)
        // if(!response){
        //   this.router.navigate(['/home'],{ replaceUrl:true })
        // }
      // }
    });
  }

  checkLinkType(){
    console.log("DATA: ",this.utils.isLoggedIn(),this.profileInfo)
    switch (this.type) {
      case "project":
        this.verifyLink()
        break;
    
      default:
        break;
    }
  }

  async verifyLink(){
    let userType = ""
    userType = localStorage.getItem("userType") || localStorage.getItem("usertype") || ""
    if(!this.utils.isLoggedIn()){
      this.router.navigate(['project-details'], { state: { link: this.linkId, referenceFrom: "link" }, replaceUrl:true });
      return
    }else if(!this.permittedUsers.includes(userType)){
      this.toastService.presentToast("CONTENT_NOT_AVAILABLE_FOR_ROLE","danger")
      setTimeout(async() => {
        const options = {
          type:"redirect",
          pathType:"home",
          replacePath: true
        };
        let response = await this.utils.postMessageListener(options)
        if(!response){
          this.navCtrl.back()
        }
      }, 1500);
      return
    }
    this.apiService.post(urlConfig.project.verifyLink+this.linkId+"?createProject=false",this.profileInfo).subscribe(async(response:any)=>{
      if(response && response.result){
        switch (response.result.type) {
          case "improvementProject":
            // this.router.navigate(['/home'],{ replaceUrl:true })
            let queryData = (({ isATargetedSolution, link, projectId, solutionId }) =>
              ({ isATargetedSolution, link, projectId, solutionId }))(response.result);
            setTimeout(() => {
              this.router.navigate(['project-details'], { state: { ...queryData, referenceFrom: "link" }, replaceUrl: true });
            }, 100);
            break;
        
          default:
            break;
        }
      }else{
        const options = {
          type:"redirect",
          pathType:"home"
        };
        setTimeout(async() => {
        let response = await this.utils.postMessageListener(options)
        if(!response){
          this.navCtrl.back()
        }
        }, 1500);
      }
    },async(error:any)=>{
      this.toastService.presentToast("LINK_INVALID_ERROR","danger")
      // this.router.navigate(['/home'],{ replaceUrl:true })
      setTimeout(async() => {
      const options = {
        type:"redirect",
        pathType:"home"
      };
      let response = await this.utils.postMessageListener(options)
      if(!response){
        this.router.navigate(['/home'],{ replaceUrl:true })
      }
      }, 1500);
    })
  }

}