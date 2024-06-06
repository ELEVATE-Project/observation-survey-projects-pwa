import {  Component, OnInit, inject } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project-details.page.html',
})
export class ProjectDetailsPage  implements OnInit {
  router: Router;
  projectData:any;
    constructor() {
      this.router = inject(Router);
    }

    ngOnInit(): void {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.projectData = this.router.getCurrentNavigation()?.extras.state;
        }
      });
    }


}
