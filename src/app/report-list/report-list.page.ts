import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UrlConfig } from '../interfaces/main.interface';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.page.html',
  styleUrls: ['./report-list.page.scss'],
})
export class ReportListPage implements OnInit {
  stateData: any;
  listType!: keyof UrlConfig;

  constructor(private navCtrl: NavController, private router: Router
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.stateData = navigation.extras.state;
      this.listType = this.stateData?.listType;
    }
  }

  navigateTo(data: any) {
    this.router.navigate([data?.redirectionUrl], { state: data });
  }

  goBack() {
    this.navCtrl.back();
  }
}
