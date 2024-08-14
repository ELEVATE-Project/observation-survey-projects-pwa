import {  Component, OnInit, inject } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../services/profile/profile.service';
import { ToastService } from '../services/toast/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss']
})
export class ProjectDetailsPage  implements OnInit {
  router: Router;
  projectData:any;
  config = {
    maxFileSize: 50,
    baseUrl: environment.baseURL,
    accessToken: localStorage.getItem('accToken'),
    profileInfo: {}
  }
  showDetails = false
    constructor(private navCtrl: NavController, private profileService: ProfileService, private location: Location) {
      this.router = inject(Router);
      this.getProfileDetails()
    }

    ngOnInit(): void {
      this.projectData = this.router.getCurrentNavigation()?.extras.state;
    }

    goBack(){
      this.navCtrl.back();
    }

    getProfileDetails() {
      this.profileService.getProfileAndEntityConfigData().subscribe((mappedIds) => {
        if (mappedIds) {
          this.config.profileInfo = mappedIds;
          this.showDetails = true
        }else{
          this.showDetails = true
        }
      });
    }
}
