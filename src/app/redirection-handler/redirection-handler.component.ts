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
      if(!this.utils.isLoggedIn()){
        this.checkLinkType()
      }else{
        this.getProfileDetails()
      }
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
      }else{
        this.router.navigate(['/home'],{ replaceUrl:true })
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
    this.apiService.post(urlConfig.project.verifyLink+this.linkId+"?createProject=false",this.profileInfo).subscribe((response:any)=>{
      if(response && response.result){
        switch (response.result.type) {
          case "improvementProject":
            window.history.replaceState({}, '','/home');
            let queryData = (({ isATargetedSolution, link, projectId, solutionId }) =>
              ({ isATargetedSolution, link, projectId, solutionId }))(response.result);
            setTimeout(() => {
              this.router.navigate(['project-details'], { state: { ...queryData, referenceFrom: "link" } });
            }, 100);
            break;
            
          default:
            break;
        }
      }else{
        this.navCtrl.back()
      }
    },(error:any)=>{
      this.toastService.presentToast(error?.error?.message || "LINK_INVALID_ERROR","danger")
      setTimeout(() => {
        this.router.navigate(['/home'],{ replaceUrl:true })
      }, 2000);
    })
  }

}