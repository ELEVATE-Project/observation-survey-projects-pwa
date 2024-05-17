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

  async presentToast(message:any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      icon:"globe",
      color: "danger"
    });

    await toast.present();
  }
}
