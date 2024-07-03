import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiBaseService } from '../services/base-api/api-base.service';
import { ToastService } from '../services/toast/toast.service';
import urlConfig from 'src/app/config/url.config.json';
import { FETCH_Profile_FORM } from '../core/constants/formConstant';
import { MainFormComponent } from 'elevate-dynamic-form';

enum EntityType {
  State = 'state',
  District = 'district',
  Block = 'block',
  Cluster = 'cluster',
}

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  formJson: any = [];
  currentSelectedOption: EntityType = EntityType.State;

  constructor(
    private baseApiService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getFormJson();
  }

  async getFormJson() {
    await this.loader.showLoading("Please wait while loading...");
    this.baseApiService.post(urlConfig['formListing'].listingUrl, FETCH_Profile_FORM)
      .pipe(
        finalize(() => this.loader.dismissLoading()),
        catchError(err => {
          this.toastService.presentToast(err?.error?.message);
          return of(null);
        })
      )
      .subscribe((res:any) => {
        if (res?.status === 200) {
          this.formJson = res?.result?.data;
          this.getOptionsData(EntityType.State);
        }
      });
  }

  getOptionsData(entityType: EntityType, entityId?: string) {
    const urlPath = entityType === EntityType.State
      ? `/entityListBasedOnEntityType?entityType=${entityType}`
      : `/subEntityList/${entityId}?type=${entityType}&search=&page=1&limit=100`;
      
    this.baseApiService.get(urlConfig['entityListing'].listingUrl + urlPath)
      .pipe(
        catchError(err => {
          this.toastService.presentToast(err?.error?.message);
          return of(null);
        })
      )
      .subscribe((res:any) => {
        if (res?.status === 200) {
          const options = (entityId ? res?.result?.data : res?.result)?.map((entity: any) => ({
            label: entity.name,
            value: entity._id,
          }));
          this.updateFormOptions(entityType, options);
        } else {
          this.toastService.presentToast(res?.message);
        }
      });
  }

  updateFormOptions(entityType: EntityType, options: any) {
    const control = this.formJson.find((control: any) => control.name === entityType);
    if (control) {
      control.options = options;
    }
  }

  onOptionChange(event: any) {
    const { event: selectedEvent, control } = event;
    const selectedValue = selectedEvent?.value;
    this.updateFormValue(control.name, selectedValue?.value);

    const nextEntityType = this.getNextEntityType(control.name as EntityType);
    if (nextEntityType) {
      this.resetDependentControls(nextEntityType);
      this.getOptionsData(nextEntityType, selectedValue?.value);
    }
  }

  getNextEntityType(current: EntityType): EntityType | null {
    switch (current) {
      case EntityType.State: return EntityType.District;
      case EntityType.District: return EntityType.Block;
      case EntityType.Block: return EntityType.Cluster;
      default: return null;
    }
  }

  resetDependentControls(startingEntity: EntityType) {
    const entityTypes = [EntityType.District, EntityType.Block, EntityType.Cluster];
    const startIndex = entityTypes.indexOf(startingEntity);
    entityTypes.slice(startIndex).forEach(entityType => this.resetFormControl(entityType));
  }

  resetFormControl(controlName: EntityType) {
    const control = this.formLib?.myForm.get(controlName);
    if (control) {
      control.patchValue('');
      control.markAsPristine();
      control.markAsUntouched();
    }
  }

  updateFormValue(controlName: EntityType, value: any) {
    const control = this.formJson.find((formControl: any) => formControl.name === controlName);
    if (control) {
      control.value = value;
    }
  }

  updateProfile() {
    if (this.formLib?.myForm.valid) {
      this.baseApiService.patch(urlConfig['profileListing'].updateUrl, this.formLib.myForm.value)
        .pipe(
          catchError(err => {
            this.toastService.presentToast(err?.error?.message);
            return of(null);
          })
        )
        .subscribe((res:any) => {
          if (res?.status === 200) {
          }
        });
    } else {
      this.toastService.presentToast('Please fill out the form correctly.');
    }
  }
}
