import { Injectable } from '@angular/core';
import { CertificateVerificationPopoverComponent } from 'src/app/shared/certificate-verification-popover/certificate-verification-popover.component';
import { PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private popoverController: PopoverController) { }

  isMobile(){
    return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  }

  isLoggedIn(){
    return !!localStorage.getItem('accToken')
  }

  async openCertificateVerificationPopover(res: any) {
    const popover = await this.popoverController.create({
      component: CertificateVerificationPopoverComponent,
      componentProps: {
        data: res
      },
      cssClass: 'certificate-popup',
      backdropDismiss: true
    });
    await popover.present();
    await popover.onDidDismiss(); 
  }

  async clearDatabase(){
    const db = await this.dbServices.openDatabase();
    if (db) {
      await this.dbServices.clearDb(db, 'projects');
      await this.dbServices.clearDb(db, 'downloadedProjects');
    }
  }

}
