import { Component, OnInit, ViewChild, HostListener, destroyPlatform } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize, catchError, map } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { FETCH_Profile_FORM } from '../core/constants/formConstant';
import { MainFormComponent } from 'elevate-dynamic-form';
import { AlertController, NavController } from '@ionic/angular';
import { AttachmentService } from '../services/attachment/attachment.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage {
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  formJson: any = [];
  urlProfilePath = urlConfig['profileListing'];
  formData: any;
  localImage:any;

  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private attachment: AttachmentService
  ) {
    this.getFormJsonAndData();
  }

  async getFormJsonAndData() {
    await this.loader.showLoading("Please wait while loading...");
    forkJoin({
      formJson: this.apiBaseService.post(urlConfig['formListing'].listingUrl, FETCH_Profile_FORM),
      profileFormData: this.apiBaseService.get(urlConfig['profileListing'].listingUrl)
    })
    .pipe(
      finalize(async () => await this.loader.dismissLoading()),
      catchError(err => {
        this.toastService.presentToast(err?.error?.message, 'danger');
        return throwError(() => err);
      })
    )
    .subscribe((res: any) => {
      if (res.formJson?.status === 200 && res.profileFormData?.status === 200) {
        this.formJson = res.formJson?.result?.data;
        this.formData = res.profileFormData?.result;
    this.formJson.isUploaded = true;
    this.getDownloadImage();
        this.mapProfileDataToFormJson(this.formData);
        this.formJson.map((control: any) => {
          if (control.dynamicEntity) {
            this.getOptionsData(control.name);
          }
        });
      }
    }
  );
  }

  mapProfileDataToFormJson(formData?: any) {
      Object.entries(formData).forEach(([key, value]:any) => {
        const control = this.formJson.find((control: any) => control.name === key);
        if (control) {
            control.value =  typeof(value) === 'string' ? String(value):value;
            control.value =  typeof(value) === 'object' ? value?.value:value?.value;
            console.log(value)

        }
      });
  }

  getOptionsData(entityType: string, entityId?: string) {
    const control = this.formJson.find((control: any) => control.name === entityType);
    if (!control) return;
    const urlPath = control.dependsOn
      ? this.urlProfilePath.subEntityUrl + `/${entityId}?type=${entityType}`
      : this.urlProfilePath.entityUrl + `${entityType}`;

    this.apiBaseService.get(urlConfig['entityListing'].listingUrl + urlPath)
      .pipe(
        catchError(err => {
          this.toastService.presentToast(err?.error?.message, 'danger');
          return throwError(() => err);
        })
      )
      .subscribe((res:any) => {
        if (res?.status === 200) {
          const result = control.dynamicEntity ? res?.result : res?.result?.data;
          if(result){
            const options = result.map((entity: any) => ({
              label: entity.name,
              value: entity._id
            }));
            this.updateFormOptions(entityType, options);
          }
        } else {
          this.toastService.presentToast(res.message, 'warning');
        }
      });
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
      this.getOptionsData(nextEntityType, selectedValue?.value);
    }
  }

  getNextEntityType(currentEntityType: string): string | null {
    const nextControl = this.formJson.find((ctrl: any) => ctrl.dependsOn === currentEntityType);
    return nextControl ? nextControl.name : null;
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
        this.formJson.isUploaded = false;
        let abc = this.formLib?.myForm.value;
        abc.location = "a";
        abc.about = "q";
        this.apiBaseService.patch(this.urlProfilePath.updateUrl, abc)
        .pipe(
          catchError(err => {
            this.toastService.presentToast(err?.error?.message, 'danger');
            return throwError(() => err);
          })
        )
        .subscribe((res:any) => {
          if (res?.status === 200) {
            this.toastService.presentToast(res?.message || 'Profile Updated Sucessfully', 'success');
          }else{
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

  goBack() {
    this.navCtrl.back();
  }

  async imageUploadEvent(event:any) {
    this.localImage = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (file: any) => {
      this.formJson.image = file.target.result
      this.formJson.isUploaded = false;
    }
  }

  imageRemoveEvent(event:any){
    this.formJson.image = '';
    this.formLib?.myForm.markAsDirty();
    this.formJson.isUploaded = true;
  }

  async getImageUploadUrl(file:any) {
    this.loader.showLoading("Please wait while uploading...");
    // this.apiBaseService.get(this.urlProfilePath.getSessionImageUploadUrl + file.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase())
    this.apiBaseService.get(this.urlProfilePath.getSessionImageUploadUrl + file?.name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase())

    .pipe(
      finalize(async () => await this.loader.dismissLoading()),
      catchError(err => {
        this.toastService.presentToast(err?.error?.message, 'danger');
        return throwError(() => err);
      })
    )
    .subscribe((res:any) => {
    return this.upload(file, res.result).subscribe()
    });
  }


   getDownloadImage() {
    this.apiBaseService.get(this.urlProfilePath.getDownloadableUrl + 'users/162-1720684914372-image_removebg_preview_2_png')
    .pipe(
      finalize(async () => await this.loader.dismissLoading()),
      catchError(err => {
        this.toastService.presentToast(err?.error?.message, 'danger');
        return throwError(() => err);
      })
    )
    .subscribe((res:any) => {
      this.formJson.image = res.result
      this.formJson.isUploaded = false;
    });
  }

  upload(data:any, uploadUrl:any) {
    return this.attachment.cloudImageUpload(data,uploadUrl).pipe(
      map((()=>{
      this.formJson.image = uploadUrl.destFilePath;
      this.formJson.isUploaded = true;
      this.updateProfile();
    })))
  }
}
