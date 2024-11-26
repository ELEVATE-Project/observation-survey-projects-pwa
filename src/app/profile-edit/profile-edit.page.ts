import { Component, HostListener, ViewChild } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { MainFormComponent } from 'elevate-dynamic-form';
import { NavController } from '@ionic/angular';
import { AttachmentService } from '../services/attachment/attachment.service';
import { ProfileService } from '../services/profile/profile.service';
import { AlertService } from '../services/alert/alert.service';
import { isDeactivatable } from '../services/guard/guard.service';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements isDeactivatable {
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  @ViewChild('formLib2') formLib2: MainFormComponent | undefined;

  formJson: any = [];
  urlProfilePath = urlConfig['profileListing'];
  formData: any;
  formJson2: any;
  localImage: any;
  enableForm: boolean = false;
  dynamicEntityValueChanged:boolean = false;
  subUrl = (environment.baseURL.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey )

  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private attachment: AttachmentService,
    private profileService: ProfileService,
    private alertService: AlertService
  ) { }

  ionViewWillEnter() {
    this.loadFormAndData();
  }

  ionViewWillLeave() {
    if (this.alertService.alert) {
      this.alertService.dismissAlert();
    }
  }

  loadFormAndData() {
    this.loader.showLoading("LOADER_MSG");
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
          this.formJson.map((control: any) => {
            if (control.dynamicEntity) {
              this.getOptionsData(control.name);
            }
          });
        } 
      },(err:any)=>{
        this.toastService.presentToast(err?.error?.message, 'danger');
      })
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

    Object.entries(formData || {}).forEach(([key, value]: any) => {
      let control = this.formJson.find((control: any) => control.name === key);
      if (control) {
        this.updateControlValue(control, value);
        if (control.dynamicEntity) {
          this.getEntityForm(value, control, true);
        }
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

  getOptionsData(entityType: string, entityId?: string, formJson?: any) {
    const formArray = formJson ? formJson : this.formJson
    const control = formArray.find((control: any) => control.name === entityType);
    if (!control) return;
  
    const hasDynamicUrl = formArray.some((control: any) => control.dynamicUrl);
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
          const result = control.dynamicUrl ? res?.result : control.dynamicEntity ? res?.result : res?.result?.data;
          if (result) {
            const options = result.map((entity: any) => ({
              label: entity?.label || entity?.name,
              value: entity?.value || entity?._id,
              externalId: entity?.externalId
            }));
  
            this.updateFormOptions(entityType, options, formArray);

            if (!hasDynamicUrl || control.dynamicUrl) {
              this.enableForm = true;
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

  updateFormOptions(entityType: string, options: any, formJson: any) {
    const formArray = formJson ? formJson : this.formJson;
    const control = formArray.find((control: any) => control.name === entityType);
    if (control) {
      control.options = options;
    }
  }

  handleOptionChange(event: any, formJson: any, dynamicEntity:any) {
    const { event: selectedEvent, control } = event;
    const selectedValue = selectedEvent?.value;
    const entityId = selectedValue?.externalId;
   const sendFormJson = dynamicEntity? false : formJson;
  
    this.updateFormValue(control.name, selectedValue?.value, sendFormJson);
    this.resetDependentControls(control.name, selectedValue?.value, sendFormJson);
    const nextEntityType = this.getNextEntityType(control.name, sendFormJson);
  
    if (nextEntityType) {
      nextEntityType.map((ctrl: any) => {
        this.getOptionsData(ctrl, selectedValue?.value, sendFormJson);
      });
    }

    if(dynamicEntity){
    this.formJson2 = [];
    this.getEntityForm(entityId, control);
    this.dynamicEntityValueChanged = true;
    }
  }
  
  onOptionChange(event: any) {
    this.handleOptionChange(event, this.formJson, true);
  }
  
  onOptionChange2(event: any) {
    this.handleOptionChange(event, this.formJson2, false);
  }
 
  getEntityForm(subType: any, entityData: any, firstLoad?: any) {
    const entityForm = {
      type: firstLoad ? subType?.externalId : subType,
      subType: firstLoad ? subType?.externalId : subType,

    }
    this.apiBaseService.post(this.subUrl+urlConfig['formListing'].listingUrl, entityForm)
      .subscribe({
        next:
          (res: any) => {
            this.formJson2 = res?.result?.data || [];
            this.formJson2.map((control: any) => {
              let entityIds = entityData?.value ;

              const dependentValue = this.getDependentValue(control, entityData);
          
              if(dependentValue || !this.dynamicEntityValueChanged){
                this.getOptionsData(control.name, entityIds, this.formJson2);
                if (firstLoad) {
                  Object.entries(this.formData || {}).forEach(([key, value]: any) => {
                    let control = this.formJson2.find((control: any) => control.name === key);
                    if (control) {
                      this.updateControlValue(control, value);
                    }
                  });
                }
              }
             
            });
          },
        error: (err: any) => {
          this.toastService.presentToast(err?.error?.message, 'danger');
        }
      })
  }

  getDependentValue(control: any, entityId: any) {
    if (control?.dependsOn && entityId?.name && control.dependsOn === entityId.name) {
      return entityId?.value;
    }
    return null;
  }

  getNextEntityType(currentEntityType: string, formJson?: any): any {
    const formArray = formJson ? formJson : this.formJson;

    const nextControls = formArray.filter((ctrl: any) => ctrl.dependsOn === currentEntityType);
    return nextControls ? nextControls.map((ctrl: any) => ctrl.name) : null
  }


  resetDependentControls(controlName: string, selectedValue: any, formJson?: any) {
    const formArray = formJson ? formJson : this.formJson;

    const dependentControls = formArray.filter((formControl: any) => formControl.dependsOn === controlName);
    for (const formControl of dependentControls) {
      formControl.options = [];
      formControl.value = ''
      this.resetFormControl(formControl.name);
      this.resetDependentControls(formControl.name, selectedValue, formArray);
    }
  }

  resetFormControl(controlName: string) {
    const control = this.formLib?.myForm.get(controlName);
    const formControlTwo = this.formLib2?.myForm.get(controlName)
    if (control) {
      control.patchValue('');
      control.markAsPristine();
      control.markAsUntouched();
    }
    if(formControlTwo){
      formControlTwo.patchValue('');
      formControlTwo.markAsPristine();
      formControlTwo.markAsUntouched();
    }
  }

  updateFormValue(controlName: string, value: any, formJson?: any) {
    const formArray = formJson ? formJson : this.formJson;

    const control = formArray.find((formControl: any) => formControl.name === controlName);
    if (control) {
      control.value = value;
    }
  }

  updateProfile() {
    if (this.formLib?.myForm.valid && this.formLib2?.myForm.valid) {
      if (this.formJson.image && !this.formJson.isUploaded) {
        this.getImageUploadUrl(this.localImage);
      } else {
        let payload = {
          ...this.formLib?.myForm.value,
          ...this.formLib2?.myForm.value,
          location: "bangalore",
          about: "PWA"
        };
        this.formJson.forEach((control: any) => {
          if (control.dynamicUrl) {
            const controlValues = payload[control.name]
            const result = controlValues.map((option: any) => +(option.value));
            payload[control.name] = result;
          }
        });
        payload = this.removeEmptyValueKeys(payload)
        !this.formJson.isUploaded ? payload.image = "" : payload?.image;
        this.formJson?.destFilePath ? payload.image = this.formJson?.destFilePath : "";
        this.formJson.isUploaded = true;
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
              this.formLib2?.myForm.markAsPristine();
              this.navCtrl.back();
              this.toastService.presentToast(res?.message || 'PROFILE_UPDATE_SUCCESS', 'success');
            } else {
              this.toastService.presentToast(res?.message, 'warning');
            }
          });
      }
    } else {
      this.formLib?.myForm.markAllAsTouched();
      this.formLib2?.myForm.markAllAsTouched();
      this.toastService.presentToast('FORM_REQUIRED_FIELDS_ERROR', 'danger');
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

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: any) {
  //   if (this.formLib && !this.formLib?.myForm.pristine || !this.formJson.isUploaded) {
  //     event.preventDefault();
  //     this.location.go(this.location.path());
  //   }
  // }

  async canPageLeave(event?: any): Promise<boolean> {
    if (this.alertService.alert) {
      this.alertService.dismissAlert();
    }
    if ((this.formLib && !this.formLib?.myForm.pristine || !this.formJson.isUploaded || !this.formLib2?.myForm.pristine)) {
      await this.alertService.presentAlert(
        'SAVE_DATA',
        'EXIT_CONFIRMATION_MSG',
        [
          {
            text: "DON'T_SAVE",
            cssClass: 'secondary-button',
            role: 'exit',
            handler: () => {
              this.formLib?.myForm.markAsPristine();
              this.formLib2?.myForm.markAsPristine();
              !this.formJson.isUploaded ? this.formJson.isUploaded = true : this.formJson.isUploaded;
              if (event) {
                this.navCtrl.back();
              }
              return true;
            }
          },
          {
            text: 'SAVE',
            cssClass: 'primary-button',
            role: 'cancel',
            handler: () => {
              this.updateProfile();
              // if (event) {
              //   this.navCtrl.back();
              // }
              return true;
            }
          }
        ]
      );

      // const cancelButton = document.createElement('button');
      // cancelButton.textContent = 'X';
      // cancelButton.classList.add('cancel-button');
      // cancelButton.onclick = () => {
      //   this.alertService.dismissAlert();
      // };

      // const alertHeader = document.querySelector('ion-alert .alert-head');
      // if (alertHeader) {
      //   alertHeader.appendChild(cancelButton);
      // }


      let data = await this.alertService.alert.onDidDismiss();
      if (data.role == 'exit') {
        return true;
      }
      return false;
    } else {
      if (event) {
        this.navCtrl.back();
        return false;
      } else {
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
    this.loader.showLoading("UPLOAD_PROGRESS_MSG");
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
              this.toastService.presentToast('IMAGE_UPLOAD_SUCCESS', 'success');
            },
            error: (err) => {
              this.toastService.presentToast(err?.error?.message || 'UPLOAD_FAILED', 'danger');
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

  removeEmptyValueKeys(data:any){
    return Object.fromEntries(
      Object.entries(data).filter(([_,value]) => value !== "" && value !== null && 
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0))
    )
  }
}