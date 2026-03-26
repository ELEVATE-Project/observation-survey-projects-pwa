import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private loadingCount = 0;
  constructor(private loadingCtrl : LoadingController,private translate:TranslateService) { }

  async showLoading(message: string) {
    this.loadingCount++;

    if (this.loadingCount > 1) return;

    const translatedMsg = await firstValueFrom(this.translate.get(message));

    this.loading = await this.loadingCtrl.create({ message: translatedMsg });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      return;
    }

    this.loadingCount--;

    if (this.loadingCount > 0) return;

    try {
      await this.loading?.dismiss();
    } catch {}

    this.loading = null;
  }
}
