import { Component, OnInit,inject } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { ToastService } from '../services/toast/toast.service';
import { ProjectsApiService } from '../services/projects-api/projects-api.service';
import urlConfig from 'src/app/config/url.config.json';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-certificate-verify',
  templateUrl: './certificate-verify.page.html',
  styleUrls: ['./certificate-verify.page.scss'],
})
export class CertificateVerifyPage implements OnInit {
  userId:any;
  loader: LoaderService;
  toastService: ToastService;
  baseApiService: ProjectsApiService;
  userName:any;
  projectName:any;
  endDate:any;

  constructor( private activatedRoute: ActivatedRoute) { 
    this.baseApiService = inject(ProjectsApiService);
    this.loader = inject(LoaderService);
    this.toastService = inject(ToastService);
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getCertificate()
  }
    async getCertificate() {
      await this.loader.showLoading("LOADER_MSG");
      this.baseApiService
        .post(urlConfig.certificate.verifyCertificateUrl + `/${this.userId}`, {})
        .pipe(
          finalize(async () => {
            await this.loader.dismissLoading();
          })
        )
        .subscribe(
          async (res: any) => {
            if (res.result) {
              this.userName = res.result?.userName;
              this.projectName = res.result?.projectName;
              this.endDate=res?.result?.completedDate
            } else {
              this.toastService.presentToast('SOMETHING_WENT_WRONG', 'danger');
            }
          },
          (err: any) => {
            this.toastService.presentToast(err?.error?.message, 'danger');
          }
        );
    }
}
