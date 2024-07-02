import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize } from 'rxjs';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { FETCH_Profile_FORM } from '../core/constants/formConstant';
import { UrlConfig } from '../interfaces/main.interface';
import { MainFormComponent } from 'elevate-dynamic-form';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  @ViewChild('formLib') formLib: MainFormComponent | undefined
  formData: any;
  baseApiService: any;
  toastService: any;
  loader: LoaderService;
  formJson: any = [];
  pathType = 'formDataUrl';
  currentSelectedOption = 'state'

  constructor(private http: HttpClient) {
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.toastService = inject(ToastService)
  }

  ngOnInit() {
    this.getFormJson();
    this.getOptionsData(this.currentSelectedOption);
  }
  async getFormJson() {
    await this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .post(
        urlConfig['formListing'].listingUrl, FETCH_Profile_FORM)
      .pipe(
        finalize(async () => {
          await this.loader.dismissLoading();
        })
      )
      .subscribe((res: any) => {
        if (res?.status === 200) {
          this.formJson = res?.result?.data;
          this.getOptionsData('state');
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message);
        }
      );
  }

  getOptionsData(entityType: any, entityId?: any) {
    const urlPath = entityType == 'state' ? `/entityListBasedOnEntityType?entityType=${entityType}` : `/subEntityList/${entityId}?type=${entityType}&search=&page=1&limit=100`
    this.baseApiService
      .get(
        urlConfig['entityListing'].listingUrl + urlPath
      )
      .pipe(
        finalize(async () => {
        })
      )
      .subscribe((res: any) => {
        console.log(res)
        if (res?.status === 200) {
          const result = entityId ? res?.result?.data : res?.result
          const entityOptions = result?.map((entityList: any) => {
            return { label: entityList.name, value: entityList._id };
          });
          this.formJson.find((control: any) => control.name === entityType).options = entityOptions;
        } else {
          this.toastService.presentToast(res?.message);
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message);
        }
      );
  }

  onOptionChange(event: any) {
    const { event: selectedEvent, control } = event;
    const selectedValue = selectedEvent?.value;
    this.currentSelectedOption = control.name;
    this.formJson.find((formControl: any) => formControl.name === control.name).value = selectedValue?.value;
    if (control.name === 'state') {
      this.resetFormControl('district');
      this.resetFormControl('block');
      this.resetFormControl('cluster');
      this.currentSelectedOption = 'district';
    } else if (control.name === 'district') {
      this.resetFormControl('block');
      this.resetFormControl('cluster');
      this.currentSelectedOption = 'block';
    } else if (control.name === 'block') {
      this.resetFormControl('cluster');
      this.currentSelectedOption = 'cluster';
    }

    this.getOptionsData(this.currentSelectedOption, selectedValue?.value);
  }

  resetFormControl(controlName: any) {
    const control = this.formLib?.myForm.get(controlName);
    if (control) {
      control.patchValue('');
      control.markAsPristine();
      control.markAsUntouched();
    }
  }

  updateProfile() {
    if (this.formLib?.myForm.valid) {
      console.log('Form is valid:', this.formLib.myForm.value);
  
      // Proceed with the API call to update the profile
      // this.baseApiService.patch(
      //   urlConfig['profileListing'].updateUrl, this.formLib.myForm.value)
      // .pipe(
      //   finalize(() => {
      //   })
      // )
      // .subscribe((res: any) => {
      //   console.log('response', res);
      //   if (res?.status === 200) {
      //     console.log('response', res);
      //   }
      // },
      //   (err: any) => {
      //     this.toastService.presentToast(err?.error?.message);
      //   }
      // );
  
    } else {
      this.toastService.presentToast('Please fill out the form correctly.');
    }
  }
  
}
