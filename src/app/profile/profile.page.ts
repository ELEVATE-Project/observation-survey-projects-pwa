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
  enableForm:boolean=false;

  constructor(private profileService: ProfileService,
    private navCtrl: NavController,
    private loader: LoaderService,
    private toastService: ToastService
  ) { }

  ionViewWillEnter() {
    this.enableForm = false;
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
          this.formJson = formJsonRes?.result?.data || [];
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
  
    this.formJson.map((control: any) => {
      if (!(control.name in formData)) {
        formData[control.name] = control.defaultValue || '';
      }
    });
  
    if (formData.user_roles) {
      formData.user_roles = formData.user_roles.map((role: any) => ({
        label: role?.title,
        value: role?.id
      }));
    }
    this.formData.roles = formData.user_roles;
  
    const formDataEntries = Object.entries(formData);
    const lastIndex = formDataEntries?.length - 1;
  
    formDataEntries.map(([key, value]: any, index) => {
      const control = this.formJson.find((control: any) => control.name === key);
  
      if (control) {
        switch (control.type) {
          case 'select':
            const selectOption = this.formData[control.name];
            control.options = [selectOption];
            control.value = value?.value;
            break;
  
          case 'chip':
            const chipOptions = this.formData[control.name];
            control.options = chipOptions;
            control.value = value;
            break;
  
          default:
            control.value = typeof value === 'string'
              ? String(value)
              : value?.value || value;
        }
  
        control.disabled = true;
        control.validators = false;
        control.label = this.capitalizeLabelFirstLetter(control.name);
      }

      if (index === lastIndex) {
        this.enableForm = true;
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