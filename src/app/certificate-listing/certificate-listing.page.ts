import { Component, OnInit,inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { finalize } from 'rxjs';
import urlConfig from 'src/app/config/url.config.json';
import { Router } from '@angular/router';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';

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
  constructor(private navCtrl: NavController, private router: Router) { 
    this.baseApiService = inject(ProjectsApiService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ngOnInit() {
    this.getCertificateList()
  }
  async getCertificateList() {
    await this.loader.showLoading("LOADER_MSG");
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

  viewCertificate(data:any){
    this.router.navigate(["project-details"],{ queryParams: {type: "certificate", projectId: data._id }, state: {referenceFrom: "certificate"} })
  }
}
