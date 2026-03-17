import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  constructor(private loadingCtrl : LoadingController,private translate:TranslateService) { }

  async showLoading(message: string) {
    if (this.loading) return;

    try {
      const translatedMsg = await firstValueFrom(
        this.translate.get(message)
      );

      this.loading = await this.loadingCtrl.create({
        message: translatedMsg
      });

      await this.loading.present();
    } catch (e) {
      console.log('Error showing loader', e);
    }
  }

   async dismissLoading() {
    if (this.loading) {
      try {
        await this.loading.dismiss();
      } catch (e) {
        console.log('Loader already dismissed');
      }
      this.loading = null;
    }
  }
}
