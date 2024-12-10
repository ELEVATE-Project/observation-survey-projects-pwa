import { Injectable } from '@angular/core';
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
    return !!localStorage.getItem('accToken')
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

  getSelectedLanguage(){
    let selectedLanguage:any = localStorage.getItem("preferred_language")
    return JSON.parse(selectedLanguage)?.value || "en"
  }
}
