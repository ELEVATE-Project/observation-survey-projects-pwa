import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-certificate-listing',
  templateUrl: './certificate-listing.page.html',
  styleUrls: ['./certificate-listing.page.scss'],
})
export class CertificateListingPage implements OnInit {
  certificates:any;
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  goBack() {
    this.navCtrl.back();
  }

}
