import { Component } from '@angular/core';
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
  ) { }

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
        if (formJsonRes?.status === 200 || profileFormDataRes?.status === 200) {
          this.formJson = formJsonRes?.result?.data;
          this.formData = profileFormDataRes?.result;
          this.mapProfileDataToFormJson(this.formData);
        } else {
          this.toastService.presentToast('Failed to load profile data. Please try again later.', 'danger');
        }
      });
  }

  mapProfileDataToFormJson(formData?: any) {
    this.formJson.image = this.formData.image;
    this.formJson.isUploaded = true;

    this.formJson.forEach((control: any) => {
      if (!(control.name in formData)) {
        formData[control.name] = control.defaultValue || '';
      }
    });

    if (formData.user_roles) {
      formData.user_roles = formData.user_roles.map((role: any) => ({
        value: role.title
      }));
    }
    this.formData.roles = formData.user_roles;

    Object.entries(formData).forEach(([key, value]: [string, any]) => {
      const control = this.formJson.find((control: any) => control.name === key);

      if (control) {
        switch (control.type) {
          case 'select':
            control.type = "text";
            control.value = Array.isArray(value)
              ? value.map((item: any) => item.label || item)
              : value.label || value;
            break;

          case 'chip':
            control.type = "text";
            control.value = Array.isArray(value)
              ? value.map((item: any) => item.value || item)
              : typeof value === 'string'
                ? String(value)
                : value?.value || value;
            break;

          case 'text':
          default:
            control.value = Array.isArray(value)
              ? value.map((item: any) => item.value || item)
              : typeof value === 'string'
                ? String(value)
                : value?.value || value;
        }
        control.disabled = true;
        control.validators = false;
        control.label = this.capitalizeLabelFirstLetter(control.name);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  capitalizeLabelFirstLetter(label: string): string {
    if (!label) return '';
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }
}