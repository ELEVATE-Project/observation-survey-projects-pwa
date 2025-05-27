import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UrlConfig } from '../interfaces/main.interface';
import { ProfileService } from '../services/profile/profile.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.page.html',
  styleUrls: ['./report-list.page.scss'],
})
export class ReportListPage implements OnInit {
  stateData: any;
  listType!: keyof UrlConfig;

  constructor(private navCtrl: NavController, private router: Router, private activatedRoute: ActivatedRoute, private profileService: ProfileService
  ) {
    activatedRoute.queryParams.subscribe((params:any)=>{
      this.listType = params["type"]
    })
  }

  async ngOnInit() {
    this.stateData = await this.profileService.getHomeConfig(this.listType)
  }

  navigateTo(data: any) {
    !data.customNavigation ?
    this.router.navigate([data?.redirectionUrl], { queryParams: { type: data.listType, reportPage: data?.reportPage } }) :
    location.href = data.redirectionUrl
  }

}
