import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import NavConfig from '../../config/nav.config.json'

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent {
  selectedIndex = 0;

  navItems = NavConfig;
  constructor(private router: Router) {}


  onNavigate(route: string, index: number): void {
    this.selectedIndex = index;
    this.router.navigate([route]);
  }
}
