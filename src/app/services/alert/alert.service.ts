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
    const translation = await this.translate.get([message,header,...buttons.map(b => b.text)]).toPromise();
    const translatedButtons = buttons.map(button => ({
      text: translation[button.text],
      cssClass: button.cssClass,
      role: button.role,
      handler: button.handler
    }));
    this.alert = await this.alertController.create({
      message: translation[message],
      header: translation[header],
      buttons: translatedButtons,
      backdropDismiss: false
    });
    
    await this.alert.present();
  }

  async dismissAlert() {
    await this.alert ? this.alert.dismiss() : null;
  }
}
