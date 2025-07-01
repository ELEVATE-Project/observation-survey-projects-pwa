import { Injectable } from '@angular/core';
import { CertificateVerificationPopoverComponent } from 'src/app/shared/certificate-verification-popover/certificate-verification-popover.component';
import { PopoverController } from '@ionic/angular';
import { DbService } from '../db/db.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private popoverController: PopoverController,private dbService:DbService,private router: Router) { }

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

  async validateToken(token:any){
    const tokenDecoded: any = await jwtDecode(token);
    const tokenExpiryTime = new Date(tokenDecoded.exp * 1000);
    const currentTime = new Date();
    return currentTime < tokenExpiryTime;
  }

  navigateTo(data: any) {
    !data.customNavigation ?
    this.router.navigate([data?.redirectionUrl], { queryParams: { type: data.listType, reportPage: data?.reportPage } }) :
    location.href = `http://localhost:53381/${data.redirectionUrl}`  }

    getPreferredLanguage(){
      let preferredLanguage = localStorage.getItem("preferredLanguage")
      return preferredLanguage || "en"
    }
}
