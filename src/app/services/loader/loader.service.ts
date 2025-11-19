import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loading:any;
  constructor(private loadingCtrl : LoadingController,private translate:TranslateService) { }

  async showLoading(message:string){
    this.translate.get(message).subscribe((data:any) => {
      message = data
    })
    this.loading = await this.loadingCtrl.create({
      message: message
    });
    await this.loading?.present();
  }

  async dismissLoading(){
    await this.loading?.dismiss();
  }
}
