import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loading:any;
  constructor(private loadingCtrl : LoadingController) { }

  async showLoading(message:string){
    this.loading = await this.loadingCtrl.create({
      message: message
    });
    await this.loading.present();
  }

  async dismissLoading(){
    await this.loading.dismiss();
  }
}
