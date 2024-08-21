import { Component, ViewChild } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { MainFormComponent } from 'elevate-dynamic-form';
import { NavController } from '@ionic/angular';
import { AttachmentService } from '../services/attachment/attachment.service';
import { ProfileService } from '../services/profile/profile.service';
import { AlertService } from '../services/alert/alert.service';
import { Router } from '@angular/router';
import { isDeactivatable } from '../services/guard/guard.service';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements isDeactivatable{
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  formJson: any = [];
  urlProfilePath = urlConfig['profileListing'];
  formData: any;
  localImage: any;
  enableForm: boolean = false;

  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private attachment: AttachmentService,
    private profileService: ProfileService,
    private alertService: AlertService,
    private router : Router
  ) { }

  ionViewWillEnter() {
    this.loadFormAndData();
  }

  ionViewWillLeave() {
    if(this.alertService.alert){
      this.alertService.dismissAlert();
    }
  }

  loadFormAndData() {
    this.loader.showLoading("Please wait while loading...");
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
          this.formJson.map((control: any) => {
            if (control.dynamicEntity) {
              this.getOptionsData(control.name);
            }
          });
        } else {
          this.toastService.presentToast('Failed to load profile data. Please try again later.', 'danger');
        }
      });
  }

  mapProfileDataToFormJson(formData?: any) {
    this.formJson.image = this.formData.image || "";
    this.formJson.isUploaded = true;
    if (formData.user_roles) {
      formData.roles = formData.user_roles.map((role: any) => ({
        label: role?.title,
        value: role?.id
      }
      ));
    }


    Object.entries(formData || {}).forEach(([key, value]) => {
      const control = this.formJson.find((control: any) => control.name === key);
      if (control) {
        this.updateControlValue(control, value);
      }
    });

    this.formJson.forEach((control: any) => {
      if (!Object.keys(formData || {}).includes(control.name)) {
        this.enableForm = true;
      }
    });
  }

  updateControlValue(control: any, value: any) {
    const nextEntityType = this.getNextEntityType(control.name);
    control.value = control.dynamicUrl ? value : (typeof value === 'string' ? String(value) : value?.value);
    if (nextEntityType) {
      nextEntityType.map((ctrl: any) => this.getOptionsData(ctrl, control?.value));
    }
  }

  getOptionsData(entityType: string, entityId?: string) {
    const control = this.formJson.find((control: any) => control.name === entityType);
    if (!control) return;

    const hasDynamicUrl = this.formJson.find((control: any) => control.dynamicUrl);
    const urlPath = this.buildUrlPath(control, entityId);
    this.apiBaseService.get(urlPath)
      .pipe(
        catchError(err => {
          this.toastService.presentToast(err?.error?.message, 'danger');
          return throwError(() => err);
        })
      )
      .subscribe((res: any) => {
        if (res?.status === 200) {
          let result;
          let options;

          if (control.dynamicUrl) {
            result = res?.result;
            if (result) {
              options = result.map((entity: any) => ({
                label: entity.label,
                value: entity.value
              }));

              this.updateFormOptions(entityType, options);
              this.enableForm = true;

            }
          } else {
            result = control.dynamicEntity ? res?.result : res?.result?.data;
            if (result) {
              options = result.map((entity: any) => ({
                label: entity.name,
                value: entity._id
              }));

              this.updateFormOptions(entityType, options);
              if (!hasDynamicUrl) {
                this.enableForm = true;
              }
            }
          }
        } else {
          this.toastService.presentToast(res.message, 'warning');
        }
      });
  }

  buildUrlPath(control: any, entityId?: string): string {
    if (control.dynamicUrl) {
      return `${control.dynamicUrl}${entityId}`;
    }
    const url = control.dependsOn
      ? `${this.urlProfilePath.subEntityUrl}/${entityId}?type=${control.name}`
      : `${this.urlProfilePath.entityUrl}${control.name}`;
    return `${urlConfig['entityListing'].listingUrl}${url}`;
  }

  updateFormOptions(entityType: string, options: any) {
    const control = this.formJson.find((control: any) => control.name === entityType);
    if (control) {
      control.options = options;
    }
  }

  onOptionChange(event: any) {
    const { event: selectedEvent, control } = event;
    const selectedValue = selectedEvent?.value;
    this.updateFormValue(control.name, selectedValue?.value);
    this.resetDependentControls(control.name, selectedValue?.value);
    const nextEntityType = this.getNextEntityType(control.name);
    if (nextEntityType) {
      nextEntityType.map((ctrl: any) => {
        this.getOptionsData(ctrl, selectedValue?.value);
      })
    }
  }

  getNextEntityType(currentEntityType: string): any {
    const nextControls = this.formJson.filter((ctrl: any) => ctrl.dependsOn === currentEntityType);
    return nextControls ? nextControls.map((ctrl: any) => ctrl.name) : null
  }


  resetDependentControls(controlName: string, selectedValue: any) {
    const dependentControls = this.formJson.filter((formControl: any) => formControl.dependsOn === controlName);
    for (const formControl of dependentControls) {
      formControl.options = [];
      this.resetFormControl(formControl.name);
      this.resetDependentControls(formControl.name, selectedValue);
    }
  }

  resetFormControl(controlName: string) {
    const control = this.formLib?.myForm.get(controlName);
    if (control) {
      control.patchValue('');
      control.markAsPristine();
      control.markAsUntouched();
    }
  }

  updateFormValue(controlName: string, value: any) {
    const control = this.formJson.find((formControl: any) => formControl.name === controlName);
    if (control) {
      control.value = value;
    }
  }

  updateProfile() {
    if (this.formLib?.myForm.valid) {
      if (this.formJson.image && !this.formJson.isUploaded) {
        this.getImageUploadUrl(this.localImage);
      } else {
        let payload = this.formLib?.myForm.value;
        payload.location = "bangalore";
        payload.about = "PWA";
        !this.formJson.isUploaded ? payload.image = "" : payload?.image;
        this.formJson.forEach((control: any) => {
          if (control.dynamicUrl) {
            const controlValues = payload[control.name]
            const result = controlValues.map((option: any) => +(option.value));
            payload[control.name] = result;
          }
        });
        this.formJson?.destFilePath ? payload.image = this.formJson?.destFilePath : "";
        this.apiBaseService.patch(this.urlProfilePath.updateUrl, payload)
          .pipe(
            catchError(err => {
              this.toastService.presentToast(err?.error?.message, 'danger');
              return throwError(() => err);
            })
          )
          .subscribe((res: any) => {
            if (res?.result) {
              this.formLib?.myForm.markAsPristine();
              this.toastService.presentToast(res?.message || 'Profile Updated Sucessfully', 'success');
              this.router.navigateByUrl('/profile');
            } else {
              this.toastService.presentToast(res?.message, 'warning');
            }
          });
      }
    } else {
      this.formLib?.myForm.markAllAsTouched();
      this.toastService.presentToast('Please fill out all the required fields.', 'danger');
    }
  }

  handleSelectFocus(controlName: any) {
    const control = this.formJson.find((ctrl: any) => ctrl.name === controlName);
    if (control && control.dependsOn) {
      const dependentControl = this.formLib?.myForm.get(control.dependsOn);
      if (dependentControl && !dependentControl.value) {
        dependentControl.markAsTouched();
      }
    }
  }

  async canPageLeave(event?: any): Promise<boolean> {
    if (this.formLib && !this.formLib?.myForm.pristine || !this.formJson.isUploaded) {
      await this.alertService.presentAlert(
        'Save Data?',
        'You have unsaved data, would you like to save it before exiting?',
        [
          {
            text: "Don't Save",
            cssClass: 'secondary-button',
            role: 'exit',
            handler: () => {
              this.formLib?.myForm.markAsPristine();
              !this.formJson.isUploaded ? this.formJson.isUploaded = true:  this.formJson.isUploaded;
              if(event){
              this.navCtrl.back();
              }
              return true; 
            }
          },
          {
            text: 'Save',
            cssClass: 'primary-button',
            role: 'cancel',
            handler:() => {
              this.formJson.isUploaded = true
              return false; 
            }
          }
        ]
      );
      let data = await this.alertService.alert.onDidDismiss();
      if (data.role == 'exit') {
        return true;
      }
      return false;
    } else {
      if(event){
        this.navCtrl.back();
        return false;
      }else{
        return true;
      }
    }
  }

  async imageUploadEvent(event: any) {
    this.localImage = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (file: any) => {
      this.formJson.image = file.target.result;
      this.formJson.isUploaded = false;
    }
  }

  imageRemoveEvent(event: any) {
    this.formJson.image = '';
    this.formLib?.myForm.markAsDirty();
    this.formJson.isUploaded = false;
  }

  async getImageUploadUrl(file: any) {
    this.loader.showLoading("Please wait while uploading...");
    const lowerCase = file?.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
    const apiUrl = this.urlProfilePath.getSessionImageUploadUrl + lowerCase;

    this.apiBaseService.get(apiUrl)
      .pipe(
        finalize(async () => await this.loader.dismissLoading()),
        catchError(err => {
          this.toastService.presentToast(err?.error?.message, 'danger');
          return throwError(() => err);
        })
      )
      .subscribe((res: any) => {
        this.upload(file, res.result)
          .subscribe({
            next: () => {
              this.toastService.presentToast('Image uploaded successfully', 'success');
            },
            error: (err) => {
              this.toastService.presentToast(err?.error?.message || 'Upload failed', 'danger');
            }
          });
      });
  }

  upload(data: any, uploadUrl: any) {
    return this.attachment.cloudImageUpload(data, uploadUrl).pipe(
      map((() => {
        this.formJson.destFilePath = uploadUrl?.destFilePath;
        this.formJson.isUploaded = true;
        this.updateProfile();
      })))
  }
}
