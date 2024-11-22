import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
})
export class BottomNavigationComponent {

  selectedIndex = 0;

  navItems = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Explore', icon: 'search', route: '/explore' },
    { label: 'Create', icon: 'add_circle_outlined', route: '/create' },
    { label: 'My Journeys', icon: 'folder', route: '/my-journeys' },
    { label: 'Profile', icon: 'person', route: '/profile' },
  ];

  constructor(private router: Router) {}

  onNavigate(route: string, index: number): void {
    this.selectedIndex = index;
    this.router.navigate([route]);
  }

}
