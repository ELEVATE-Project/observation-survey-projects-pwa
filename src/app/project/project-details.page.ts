import {  Component, inject } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage  {
  router: Router;
  projectData:any;
    constructor() {
        this.router = inject(Router);
      this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.projectData = this.router.getCurrentNavigation()?.extras.state;
      }
    });
  }



}
