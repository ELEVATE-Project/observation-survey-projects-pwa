import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';
import { NavItem } from './interfaces/main.interface';
import  NavConfig  from './config/nav.config.json';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private _isNavigationVisible = new BehaviorSubject<boolean>(false);
  isNavigationVisible$ = this._isNavigationVisible.asObservable();
  navItems: NavItem[] = NavConfig;

  constructor(private swUpdate: SwUpdate, private router:Router, private translate :TranslateService) {}

  ngOnInit(){
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.checkForUpdate().then((data) => {
    //     if(data){
    //       this.swUpdate.activateUpdate().then((data)=>{
    //         window.location.reload()
    //       })
    //     }
    //   });
    // }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateNavigationVisibility(event.urlAfterRedirects);
      }
    });
  }


  private updateNavigationVisibility(currentRoute: string): void {
    const matchedNavItem = this.navItems.find((item) => item.route === currentRoute);
    const shouldShowNav = matchedNavItem?.keepNavBar ?? false;

    this._isNavigationVisible.next(shouldShowNav);
  }

}
