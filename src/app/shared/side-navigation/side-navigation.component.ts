import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarService } from 'src/app/services/nav-bar/nav-bar.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit, OnDestroy{
  selectedIndex!: number;
  navItems!:any[];


  constructor(private navigationService: NavBarService, private router:Router) {}

  ngOnInit(): void {
    this.navigationService.selectedIndex$.subscribe(index => {
      this.selectedIndex = index;
    });
    this.navigationService.initialize();
    this.navItems = this.navigationService.navItems;

  }

  onNavigate(route: string, index: number): void {
    this.navigationService.setSelectedIndex(index);
    this.router.navigate([route]);
  }

  ngOnDestroy(): void {
    this.navigationService.ngOnDestroy();
  }
}
