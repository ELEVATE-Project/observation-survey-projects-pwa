import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastController:ToastController;
  constructor() { 
    this.toastController = inject(ToastController)
  }

  async presentToast(message:any,color:any,duration:any=1500) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color: color
    });

    await toast.present();
  }
}
