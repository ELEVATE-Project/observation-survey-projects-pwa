import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { FETCH_Profile_FORM } from '../core/constants/formConstant';
import { MainFormComponent } from 'elevate-dynamic-form';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  formJson: any = [];
  urlProfilePath = urlConfig['profileListing']

  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getFormJson();
  }

  async getFormJson() {
    await this.loader.showLoading("Please wait while loading...");
    this.apiBaseService.post(urlConfig['formListing'].listingUrl, FETCH_Profile_FORM)
      .pipe(
        finalize(() => this.loader.dismissLoading()),
        catchError(err => {
          this.toastService.presentToast(err?.error?.message);
          return throwError(() => err);
        })
      )
      .subscribe((res:any) => {
        if (res?.status === 200) {
          this.formJson = res?.result?.data;
          this.formJson.map((control: any) => {
            if (control.dynamicEntity) {
              this.getOptionsData(control.name);
            }
          });
        }
      });
  }

  getOptionsData(entityType: string, entityId?: string) {
    const control = this.formJson.find((control: any) => control.name === entityType);
    if (!control) return;
    const urlPath = control.dependsOn
      ? this.urlProfilePath.subEntityUrl + `/${entityId}?type=${entityType}&search=&page=1&limit=100`
      : this.urlProfilePath.entityUrl + `${entityType}`;

    this.apiBaseService.get(urlConfig['entityListing'].listingUrl + urlPath)
      .pipe(
        catchError(err => {
          this.toastService.presentToast(err?.error?.message);
          return throwError(() => err);
        })
      )
      .subscribe((res:any) => {
        if (res?.status === 200) {
          const result = control.dynamicEntity ? res?.result : res?.result?.data;
          if(result){
            const options = result.map((entity: any) => ({
              label: entity.name,
              value: entity._id,
            }));
            this.updateFormOptions(entityType, options);
          }
        } else {
          this.toastService.presentToast(res.message);
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
  }

  resetDependentControls(controlName: string, selectedValue: any) {
    const dependentControls = this.formJson.filter((formControl: any) => formControl.dependsOn === controlName);

    for (const formControl of dependentControls) {
      this.resetFormControl(formControl.name);
      this.getOptionsData(formControl.name, selectedValue);
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
      this.apiBaseService.patch(this.urlProfilePath.updateUrl, this.formLib.myForm.value)
        .pipe(
          catchError(err => {
            this.toastService.presentToast(err?.error?.message);
            return throwError(() => err);
          })
        )
        .subscribe((res:any) => {
          if (res?.status === 200) {
            this.toastService.presentToast(res?.message || 'Profile Updated Sucessfully');
          }
        });
    } else {
      this.toastService.presentToast('Please fill out the form correctly.');
    }
  }
}
