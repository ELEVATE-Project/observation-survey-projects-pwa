import { Injectable } from '@angular/core';
import { CertificateVerificationPopoverComponent } from 'src/app/shared/certificate-verification-popover/certificate-verification-popover.component';
import { PopoverController } from '@ionic/angular';
import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private popoverController: PopoverController,private dbService:DbService) { }

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
    const db = await this.dbService.openDatabase();
    if (db) {
      await this.dbService.clearDb(db, 'projects');
      await this.dbService.clearDb(db, 'downloadedProjects');
    }
  }

}
