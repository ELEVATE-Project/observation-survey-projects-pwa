import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastController:ToastController;
  constructor(private translate: TranslateService) { 
    this.toastController = inject(ToastController)
  }
  async presentToast(message:any,color:any,duration:any=1500) {
    this.translate.get(message).subscribe(data => {
        message = data
    })
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color: color
    });

    await toast.present();
  }
}
