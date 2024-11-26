import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import NavConfig from '../../config/nav.config.json'

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit{
  selectedIndex!:number;

  navItems = NavConfig;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.selectedIndex = this.navItems.findIndex((item) => item.route === this.router.url);
    if(this.selectedIndex == -1){
      this.selectedIndex = 0
    }
  }

  onNavigate(route: string, index: number): void {
    this.selectedIndex = index;
    this.router.navigate([route]);
  }
}
