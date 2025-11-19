import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { PageTitleService } from './services/project-title/page-title.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate,private location: Location,private router: Router, private activatedRoute: ActivatedRoute,private titleService: PageTitleService) {
     this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        if (data['title']) {
          this.titleService.setTitleByKey(data['title']);
        }
      });
  }

  ngOnInit(){
    const localTheme = localStorage.getItem('theme');
    if(localTheme){
      const theme = JSON.parse(localStorage.getItem('theme') || '');
      document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
      document.documentElement.style.setProperty('--ion-color-secondary', theme.secondaryColor);
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', theme.primaryColor);
      document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    }
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then((data) => {
        if(data){
          this.swUpdate.activateUpdate().then((data)=>{
            window.location.reload()
          })
        }
      });
    }
  }
}
