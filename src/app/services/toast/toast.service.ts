import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastController:ToastController;
  activeToast: any;

  constructor(private translate: TranslateService) { 
    this.toastController = inject(ToastController)
  }
  async presentToast(message:any,color:any,duration:any=1500) {
    this.translate.get(message).subscribe(data => {
        message = data
    })

    if (this.activeToast) {
      await this.activeToast.dismiss();
    }
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color: color
    });
    this.activeToast = toast;
    await toast.present();
  }

  async dismissToast() {
    if (this.activeToast) {
      await this.activeToast.dismiss();
      this.activeToast = null;
    }
  }
}
