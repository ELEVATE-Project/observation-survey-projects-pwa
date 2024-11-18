import { Component } from '@angular/core';
import { ProfileService } from '../services/profile/profile.service';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../services/loader/loader.service';
import { catchError, finalize } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  formJson: any = [];
  formData: any;
  enableFormOne: boolean = false;
  enableFormTwo: boolean = false;
  formJson2:any;
  formListingUrl = (environment.baseURL.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['formListing'].listingUrl;

  constructor(private profileService: ProfileService,
    private navCtrl: NavController,
    private loader: LoaderService,
    private toastService: ToastService,
    private apiBaseService: ApiBaseService,

  ) { }

  ionViewWillEnter() {
    this.enableFormOne = false;
    this.enableFormTwo = false;
    this.loadFormAndData();
  }

  async loadFormAndData() {
    await this.loader.showLoading("LOADER_MSG");
    this.profileService.getFormJsonAndData()
      .pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'PROFILE_LOAD_ERROR', 'danger');
          throw err;
        }),
        finalize(async () => await this.loader.dismissLoading())
      )
      .subscribe(([formJsonRes, profileFormDataRes]: any) => {
        if (formJsonRes?.status === 200 || profileFormDataRes?.status === 200) {
          this.formJson = formJsonRes?.result?.data || [];
          this.formData = profileFormDataRes?.result;
          this.mapProfileDataToFormJson(this.formData);
        }
      },(err:any)=>{
        this.toastService.presentToast(err?.error?.message, 'danger');
      })
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
        label: role?.label,
        value: role?.id
      }));
    }
    this.formData.roles = formData.user_roles;
    this.mappingAndcheckingLastIndex(formData,this.formJson, 'enableFormOne');
  
  }


  mappingAndcheckingLastIndex(formData:any,formJson:any,enable: 'enableFormOne' | 'enableFormTwo'): void{
    const formDataEntries = Object.entries(formData);
    const lastIndex = formDataEntries?.length - 1;

    formDataEntries.map(([key, value]: any, index) => {
      const control = formJson.find((control: any) => control.name === key);

      if(control?.dynamicEntity){
        this.getEntityForm(value, control, true);

      }
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
        if(enable == "enableFormTwo"){
          this.formJson2 = formJson.filter((data:any)=>{ return data.value })
        }
        this[enable] = true;
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

  getEntityForm(subType:any,entityId:any, firstLoad?:any){
    const entityForm = {
      type: firstLoad? subType?.externalId: subType,
      subType: firstLoad? subType?.externalId : subType
    }
    this.apiBaseService.post(this.formListingUrl, entityForm)
    .subscribe({
      next:
      (res:any) => {
        this.formJson2 = res?.result?.data || [];
        this.mappingAndcheckingLastIndex(this.formData,this.formJson2,'enableFormTwo');
      },
      error: (err: any) => {
        this.toastService.presentToast(err?.error?.message, 'danger');
      }
   })
  }
}