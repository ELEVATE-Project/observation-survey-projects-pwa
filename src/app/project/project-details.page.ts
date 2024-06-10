import {  Component, OnInit, inject } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-project',
  templateUrl: './project-details.page.html',
})
export class ProjectDetailsPage  implements OnInit {
  router: Router;
  projectData:any;
  config = {
    maxFileSize: 50,
    baseUrl: window['env' as any]['baseURL' as any],
    accessToken: localStorage.getItem('accToken')
  }
    constructor(private navCtrl: NavController) {
      this.router = inject(Router);
    }

    ngOnInit(): void {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.projectData = this.router.getCurrentNavigation()?.extras.state;
        }
      });
    }

    goBack(){
      this.navCtrl.back();
    }


}
