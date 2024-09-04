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

  clearDatabase(){
    let a = window.indexedDB.open("projectPlayer", 1);
      a.onsuccess = async e => {
        const db = (e.target as IDBRequest).result;
        const transaction = db.transaction(["projects"], "readwrite");
        const store = transaction.objectStore("projects");
        const request = store.clear();
        request.onsuccess = () => {
        };
      };
  }
}
