import { Component} from '@angular/core';
import { ProfileService } from '../services/profile/profile.service';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../services/loader/loader.service';
import { catchError, finalize } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  formJson: any = [];
  formData: any;
  
  constructor(private profileService: ProfileService,
    private navCtrl: NavController,
    private loader: LoaderService,
    private toastService: ToastService
  ){}

  ionViewWillEnter() {
    this.loadFormAndData();
  }

  async loadFormAndData() {
    await this.loader.showLoading("Please wait while loading...");
    this.profileService.getFormJsonAndData()
    .pipe(
      catchError((err) => {
        this.toastService.presentToast(err?.error?.message || 'Error loading profile data. Please try again later.', 'danger');
        throw err;
      }),
      finalize(async () => await this.loader.dismissLoading())
    )
    .subscribe(([formJsonRes, profileFormDataRes]: any) => {
      if(formJsonRes?.status === 200 || profileFormDataRes?.status === 200){
        this.formJson = formJsonRes?.result?.data;
        this.formData = profileFormDataRes?.result;
        this.mapProfileDataToFormJson(this.formData);
      }else{
        this.toastService.presentToast('Failed to load profile data. Please try again later.', 'danger');
      }
    });
  }

  mapProfileDataToFormJson(formData?: any) {
    this.formJson.image = this.formData.image;
    this.formJson.isUploaded = true;
    Object.entries(formData).map(([key, value]: any) => {
      const control = this.formJson.find((control: any) => control.name === key);
      if (control) {
        control.disabled =true;
        if (control.type === 'select') {
          control.type = 'text';
        }else if(control.type === 'checkbox'){
          control.type = 'chip'
        }else{
          control.type = 'text';
        }
        control.value = typeof (value) === 'string' ? String(value) : value?.label;
        control.validators = false
        control.label = this.capitalizeLabel(control.name);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  capitalizeLabel(label: string): string {
    return label
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}