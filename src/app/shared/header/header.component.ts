import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent   {
  showHeader = environment.showHeader;
  @Input() pageTitle?: string ;
  constructor(private navCtrl: NavController) { }

  goBack() {
    this.navCtrl.back();
  }

}
