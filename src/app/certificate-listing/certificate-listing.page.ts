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
  async getCertificateList() {
    await this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .get(urlConfig.certificate.certificateListing)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
        })
      )
      .subscribe((res: any) => {
        this.certificates=res.result.data
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message, 'danger');
        }
      );
  }
}
