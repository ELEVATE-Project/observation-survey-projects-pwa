import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert:any;

  constructor(private alertController: AlertController) { }

  async presentAlert(header: string, message: string, buttons: { text: string, cssClass?: string, role?: string, handler?: () => void }[]) {
    this.alert = await this.alertController.create({
      header,
      message,
      buttons: buttons.map(button => ({
        text: button.text,
        cssClass: button.cssClass,
        role: button.role,
        handler: button.handler
      })),
      cssClass: 'custom-alert',
      backdropDismiss: false
    });

    await this.alert.present();
  }

  async dismissAlert(){
    await this.alert ? this.alert.dismiss() : null
  }
}
