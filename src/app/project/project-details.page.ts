import {  Component, OnInit, inject } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

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
    profileInfo: {
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
  }
    constructor(private navCtrl: NavController) {
      this.router = inject(Router);
    }

    ngOnInit(): void {
      this.projectData = this.router.getCurrentNavigation()?.extras.state
    }

    goBack(){
      this.navCtrl.back();
    }


}
