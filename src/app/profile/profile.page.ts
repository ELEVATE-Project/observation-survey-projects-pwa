import { Component} from '@angular/core';
import { ProfileService } from '../services/profile/profile.service';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../services/loader/loader.service';

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
  ){}

  ionViewWillEnter() {
    this.loadFormAndData();
  }

  async loadFormAndData() {
    await this.loader.showLoading("Please wait while loading...");

    this.profileService.getFormJsonAndData().subscribe(([formJsonRes, profileFormDataRes]: any) => {
      if (formJsonRes?.status === 200) {
        this.formJson = formJsonRes?.result?.data;
      }
      if (profileFormDataRes?.status === 200) {
        this.formData = profileFormDataRes?.result;
      }
      if (this.formJson && this.formData) {
        this.mapProfileDataToFormJson(this.formData);
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
        }
        control.value = typeof (value) === 'string' ? String(value) : value?.label;
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}