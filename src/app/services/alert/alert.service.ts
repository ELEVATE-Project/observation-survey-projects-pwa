import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert: any;

  constructor(private alertController: AlertController,private translate:TranslateService) { }

  async presentAlert(header: string, message: string, buttons: { text: string, cssClass?: string, role?: string, handler?: () => void }[]) {
    this.translate.get([message,header,...buttons.map(b => b.text)]).subscribe(async (data:any) => {
      message=data[message]
      header=data[header]
      let translatedButtons = buttons.map(button => ({
        text: data[button.text],
        cssClass: button.cssClass,
        role: button.role,
        handler: button.handler
      }));
      this.alert = await this.alertController.create({
        header,
        message,
        buttons: translatedButtons,
        backdropDismiss: false
      });

    await this.alert.present();
    });
  }

  async dismissAlert() {
    await this.alert ? this.alert.dismiss() : null;
  }
}
