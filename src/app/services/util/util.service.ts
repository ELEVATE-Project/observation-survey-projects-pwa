import { Injectable } from '@angular/core';
import { CertificateVerificationPopoverComponent } from 'src/app/shared/certificate-verification-popover/certificate-verification-popover.component';
import { PopoverController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private readonly STORAGE_PREFIX = 'app_';
  private networkStatus = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(private popoverController: PopoverController) {
    this.initNetworkListener();
  }

  private initNetworkListener(): void {
    window.addEventListener('online', () => this.networkStatus.next(true));
    window.addEventListener('offline', () => this.networkStatus.next(false));
  }

  public getNetworkStatus() {
    return this.networkStatus.asObservable();
  }

  isMobile(){
    return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  }

  isLoggedIn(){
    return !!localStorage.getItem('accToken')
  }

  async openCertificateVerificationPopover(res: any) {
    const popover = await this.popoverController.create({
      component: CertificateVerificationPopoverComponent,
      componentProps: {
        data: res
      },
      cssClass: 'certificate-popup',
      backdropDismiss: true
    });
    await popover.present();
    await popover.onDidDismiss(); 
  }

  public async clearDatabase(): Promise<void> {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Add IndexedDB clearing if needed
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  }

  public setStorage(key: string, value: any): void {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting storage:', error);
    }
  }

  public getStorage(key: string): any {
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting storage:', error);
      return null;
    }
  }

  public debounce(func: Function, wait: number): Function {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}
