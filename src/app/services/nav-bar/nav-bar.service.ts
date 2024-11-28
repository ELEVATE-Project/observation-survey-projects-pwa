import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import NavConfig from '../../config/nav.config.json';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {
  private selectedIndexSubject = new BehaviorSubject<number>(0);
  selectedIndex$ = this.selectedIndexSubject.asObservable();

  private routerSubscription!: Subscription;
  navItems:any[] = NavConfig;

  constructor(private router: Router) {}

  initialize() {
    this.updateSelectedIndex(this.router.url);

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSelectedIndex(event.url);
      }
    });
  }

  private updateSelectedIndex(url: string): void {
    const index = this.navItems.findIndex((item) => item.route === url);
    this.selectedIndexSubject.next(index === -1 ? 0 : index);
  }

  setSelectedIndex(index: number): void {
    this.selectedIndexSubject.next(index);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
