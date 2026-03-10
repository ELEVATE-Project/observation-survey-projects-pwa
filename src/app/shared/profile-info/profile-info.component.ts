import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent  implements OnInit {
  @Input() profileInfo: any = ''; 

  constructor(private router: Router) {}

  ngOnInit() {}

  onEditProfile() {
    this.router.navigate(['/profile']);
  }
}
