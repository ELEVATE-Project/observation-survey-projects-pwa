import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent  implements OnInit {
  profileInfo: any = ''; 

  constructor(private profileService: ProfileService, private router: Router) { 
    this.profileInfo = this.profileService.getProfileInfo();
  }

  ngOnInit() {
  }

  onEditProfile() {
    this.router.navigate(['/profile']);
  }
}
