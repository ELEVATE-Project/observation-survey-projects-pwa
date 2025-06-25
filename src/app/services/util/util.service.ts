import { Injectable } from '@angular/core';
import { CertificateVerificationPopoverComponent } from 'src/app/shared/certificate-verification-popover/certificate-verification-popover.component';
import { PopoverController } from '@ionic/angular';
import { DbService } from '../db/db.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private popoverController: PopoverController,private dbService:DbService) { }

  isMobile(){
    return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  }

  isLoggedIn(){
    return !!localStorage.getItem('accToken')?.trim()
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

  async validateToken(token:any){
    const tokenDecoded: any = await jwtDecode(token);
    const tokenExpiryTime = new Date(tokenDecoded.exp * 1000);
    const currentTime = new Date();
    return currentTime < tokenExpiryTime;
  }

  postMessageListener(data:any):Promise<boolean>{
    return new Promise((resolve) => {
      try {
        if ((window as any).FlutterChannel) {
          (window as any).FlutterChannel.postMessage(data);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err: any) {
        console.error('FlutterChannel Error:', err);
        resolve(false);
      }
    });
  }

  getPreferredLanguage(){
    let preferredLanguage = localStorage.getItem("preferredLanguage")
    return preferredLanguage || "en"
  }
}
