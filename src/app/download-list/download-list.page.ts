import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from '../services/alert/alert.service';
import { DbService } from '../services/db/db.service';

@Component({
  selector: 'app-download-list',
  templateUrl: './download-list.page.html',
  styleUrls: ['./download-list.page.scss'],
})
export class DownloadListPage implements OnInit {
  constructor(private navCtrl: NavController,private router:Router,private alertService:AlertService,private dbServices:DbService ) { }
  resultsWithDownload: any[]=[];

  async ngOnInit() {
    await this.dbServices.openDatabase();
    this.getdata();
  }

  async getdata(){
    this.resultsWithDownload = await this.dbServices.getAllTransactions()
  }

  goBack() {
    this.navCtrl.back();
  }

  navigate(data:any) {
    this.router.navigate(['project-details'], { state: { _id:data || null} });
  }

  async deletePopup(key: any) {
    if (this.alertService.alert) {
      this.alertService.dismissAlert();
    }

    await this.alertService.presentAlert(
      'DELETE_CONTENT_HEAD',
      'DELETE_CONTENT_MSG',
      [
        {
          text: 'CANCEL',
          cssClass: 'secondary-button',
          role: 'cancel',
          handler: () => {
            return false;
          }
        },
        {
          text: 'DELETE',
          cssClass: 'primary-button',
          role: 'delete',
          handler: () => {
            return true;
          }
        }
      ]
    );

      let alertResponse =  await this.alertService.alert.onDidDismiss();
      if (alertResponse.role === 'delete') {
      await this.dbServices.deleteTransaction(key);
      this.getdata();
      let data = await this.dbServices.getTransaction(key);
      this.dbServices.updateTransaction(data);
        return true;
      }
    return false;
  }

}