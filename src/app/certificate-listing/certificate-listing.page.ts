import { Component, OnInit,inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { finalize } from 'rxjs';
import urlConfig from 'src/app/config/url.config.json';

@Component({
  selector: 'app-certificate-listing',
  templateUrl: './certificate-listing.page.html',
  styleUrls: ['./certificate-listing.page.scss'],
})
export class CertificateListingPage implements OnInit {
  certificates:any;
  toastService: ToastService;
  baseApiService: any;
  loader: LoaderService;
  constructor(private navCtrl: NavController) { 
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ngOnInit() {
    this.getCertificateList()
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
