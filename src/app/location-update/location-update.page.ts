import { Component, ViewChild } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { finalize, switchMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
import { MainFormComponent } from 'elevate-dynamic-form';
import { ProfileService } from '../services/profile/profile.service';
import { LocationService } from '../services/location/location.service';
import { EncryptionService } from '../services/encryption/encryption.service';
import { environment } from 'src/environments/environment';
import { formFieldCode, locationType } from '../core/constants/statusConstants';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { UtilService } from '../services/util/util.service';

@Component({
    selector: 'app-location-update',
    templateUrl: './location-update.page.html',
    styleUrls: ['./location-update.page.scss'],
})
export class LocationUpdatePage {
    showHeader: boolean = false;
    @ViewChild('formLib') formLib: MainFormComponent | undefined;
    formJson: any = [];
    userType: any;
    userLocations: any[] = [];
    enableForm: boolean = false;
    userId = localStorage.getItem('userId') || '';
    subRoles: any
    profileData: any;
    constructor(
        private loader: LoaderService,
        private toastService: ToastService,
        private profileService: ProfileService,
        private locationService: LocationService,
        private encryptionService: EncryptionService,
        private translateService: TranslateService,
        private navCtrl: NavController,
        private utilService: UtilService
    ) { }

    // Lifecycle hook that triggers form and data loading when the page is about to enter
    ionViewWillEnter() {
        this.showHeader = !this.utilService.isWebView();
        this.loadFormAndData();
    }

    // Fetches user profile and form config, then builds the dynamic form
    async loadFormAndData() {
        await this.loader.showLoading("LOADER_MSG");
        from(this.profileService.getProfile()).pipe(
            switchMap((profileDataRes: any) => {
                this.profileData = profileDataRes;
                const rootOrgId = profileDataRes?.rootOrgId || '';
                const subType = this.getStateCode(profileDataRes?.userLocations || []);
                this.subRoles = profileDataRes?.profileUserTypes || [];
                return this.profileService.getFormConfig(rootOrgId, subType).pipe(
                    map((formConfigRes: any) => ([formConfigRes, profileDataRes]))
                );
            }),
            finalize(() => this.loader.dismissLoading())
        ).subscribe(([formConfigRes, profileDataRes]: any) => {
            const matchedPersona = this.getMatchedPersonaConfig(formConfigRes, profileDataRes);
            this.formJson = this.transformFields(matchedPersona, this.userLocations);
            this.loadDependentOptions();
        }, (err: any) => {
            this.toastService.presentToast(err?.error?.message, 'danger');
        })
    }

    // Extracts the matching persona config fields based on the user's type
    getMatchedPersonaConfig(formConfigRes: any, profileDataRes: any) {
        const fields = formConfigRes?.result?.form?.data?.fields || [];
        const personaField = fields.find((field: any) => field.code === formFieldCode.persona);
        const personaChildren = personaField?.children || {};

        const userType = profileDataRes?.profileUserType?.type;
        const allowedCodes = Object.values(locationType);
        const matchedPersona = (personaChildren[userType] || [])
            .filter((item: any) => allowedCodes.includes(item.code));

        this.userType = userType;
        this.userLocations = profileDataRes?.userLocations || [];

        return matchedPersona;
    }

    // Transforms API fields into the dynamic form's expected format with pre-filled values
    transformFields(fields: any[] = [], userLocations: any[] = []) {
        return fields.map(field => {
            const isSubPersona = field.code === locationType.subPersona;
            const isSchool = field.code === locationType.school
            const location = userLocations.find((loc: any) =>
                loc.type === field.code && (field.code !== locationType.school || loc.parentId === '')
            );
            let schoolField = null
            if(isSchool) schoolField = userLocations.find((loc: any) => loc.type === locationType.school);
            const transformed: any = {
                name: field.code,
                label: field.templateOptions?.labelHtml?.values?.['$0'] || '',
                value: '',
                type: isSubPersona ? 'chip' : field.type,
                errorMessage: {
                    required: `${this.translateService.instant('REQUIRED')} ${field.templateOptions?.labelHtml?.values?.['$0']?.toLowerCase() || field.code
                        }`
                },
                // validators: this.mapValidators(field.validations),
                validators: { required : true },
                options: isSubPersona ? field.templateOptions.options : [],
                multiple: field.templateOptions?.multiple || false,
                code: field.code,
                placeHolder: field.templateOptions?.placeHolder || ''
            };

            if (field.context) {
                transformed.dependsOn = field.context;
            }

            if (location) {
                const locationOption = { label: location.name, value: location.id };
                transformed.value = locationOption.value;
                transformed.options = [locationOption];

                // if (field.code === locationType.state || field.code === locationType.district) {
                //     transformed.disabled = true;
                // }
            }

            if (isSubPersona) {
                transformed.value = field.templateOptions.options.filter((option: any) => {
                    return this.subRoles.some((role: any) => role.subType.toLowerCase() === option.value.toLowerCase())
                })
            }

            if(schoolField){
                transformed.value = schoolField.code;
            }
            return transformed;
        });
    }

    // Returns the state code from the user's location list
    getStateCode(userLocations: any[]): string {
        const stateLocation = userLocations.find((loc: any) => loc.type === locationType.state);
        return stateLocation?.code || '';
    }

    // Maps API validation rules to the form's validator object format
    mapValidators(validations: any[] = []) {
        const validatorObj: any = {};

        validations?.forEach(v => {
            if (v.type === 'required') {
                validatorObj.required = true;
            }
        });

        return validatorObj;
    }

    // Handles dropdown selection change, resets dependents and fetches child options
    async onOptionChange(event: any) {
        const { event: selectedEvent, control } = event;
        const selectedOption = selectedEvent?.value;
        this.resetDependentFields(control?.name);
        if (control?.code === locationType.state) {
            this.enableForm = false;
            const rootOrgId = this.profileData?.rootOrgId || '';
            const subType = selectedOption?.code || '';
            if (rootOrgId && subType) {
                await this.loader.showLoading('LOADER_MSG');
                this.profileService.getFormConfig(rootOrgId, subType).pipe(
                    finalize(() => this.loader.dismissLoading())
                ).subscribe((formConfigRes: any) => {
                    const matchedPersona = this.getMatchedPersonaConfig(formConfigRes, this.profileData);
                    this.userLocations = [{
                        type: locationType.state,
                        id: selectedOption.id || selectedOption.value,
                        name: selectedOption.label,
                        code: selectedOption.code || subType
                    }];
                    this.subRoles = [];
                    this.formJson = this.transformFields(matchedPersona, []);
                    const stateField = this.formJson.find((f: any) => f.code === locationType.state);
                    if (stateField) {
                        stateField.options = [{ label: selectedOption.label, value: selectedOption.value }];
                        stateField.value = selectedOption.value;
                    }
                    setTimeout(() => {
                        this.formLib?.myForm.get(locationType.state)?.setValue(selectedOption.value);
                    }, 0);
                    this.loadDependentOptions();
                }, (err: any) => {
                    this.toastService.presentToast(err?.error?.message, 'danger');
                });
            }
            return;
        }

        if (selectedOption?.id) {
            const childField = this.formJson.find((f: any) => f.dependsOn === control?.name);
            if (childField) {
                await this.loader.showLoading('LOADER_MSG');
                this.fetchOptionsForField(selectedOption.id, childField).pipe(
                    finalize(() => this.loader.dismissLoading())
                ).subscribe((options: any[]) => {
                    childField.options = options;
                });
            }
        }
    }

    // Recursively resets all dependent fields when a parent field value changes
    resetDependentFields(parentName: string) {
        const children = this.formJson.filter((f: any) => f.dependsOn === parentName);
        children.forEach((child: any) => {
            child.options = [];
            child.value = '';
            this.formLib?.myForm.get(child.name)?.reset();
            this.formLib?.myForm.get(child.name)?.markAsUntouched();
            this.resetDependentFields(child.name);
        });
    }

    // Loads options for all dependent fields that have a pre-selected parent value
    loadDependentOptions() {
        this.formJson.forEach((field: any) => {
            if (field.code === locationType.state) {
                this.locationService.getStateList().subscribe({
                    next: (res: any) => {
                        field.options = res
                    },
                    error: (err: any) => {
                        this.toastService.presentToast(err?.error?.message, 'danger');
                    }
                })
            }
            if (field.dependsOn && !field.disabled) {
                const parentId = this.locationService.getParentId(this.userLocations, field.dependsOn);
                if (parentId) {
                    this.fetchOptionsForField(parentId, field).subscribe((options: any[]) => {
                        field.options = options;
                    });
                }
            }
        });
        this.enableForm = true;
    }

    // Fetches dropdown options for a field based on its parent's ID
    fetchOptionsForField(parentId: string, field: any) {
        if (field.name === locationType.school) {
            return this.locationService.getSchoolList(parentId);
        }
        return this.locationService.getOptionList(parentId, field.name);
    }

    // Marks the parent field as touched when a dependent field receives focus
    handleSelectFocus(controlName: any) {
        const control = this.formJson.find((ctrl: any) => ctrl.name === controlName);
        if (control && control.dependsOn) {
            const dependentControl = this.formLib?.myForm.get(control.dependsOn);
            if (dependentControl && !dependentControl.value) {
                dependentControl.markAsTouched();
            }
        }
    }

    // Validates the form, builds the payload, and submits the profile update API call
    async updateProfile() {
        if (this.formLib?.myForm.valid) {
            const formValues = this.formLib?.myForm.value;
            const resolvedValues: any = {};
            for (const key of Object.keys(formValues)) {
                const field = this.formJson.find((f: any) => f.name === key);
                const val = formValues[key];
                if (key === locationType.subPersona) continue;
                if (field && typeof val === 'string' && field.options?.length) {
                    resolvedValues[key] = field.options.find((opt: any) => opt.value === val) || val;
                } else {
                    resolvedValues[key] = val;
                }
            }
            for (const key of Object.keys(resolvedValues)) {
                if (resolvedValues[key] && typeof resolvedValues[key] === 'object') {
                    const { label, value, ...rest } = resolvedValues[key];
                    resolvedValues[key] = rest;
                }
            }
            for (const key of Object.keys(resolvedValues)) {
                const obj = resolvedValues[key];
                if (obj && typeof obj === 'object' && obj.isSchool) {
                    const field = this.formJson.find((f: any) => f.name === key);
                    const parentValue = field?.dependsOn ? resolvedValues[field.dependsOn]?.id || '' : '';
                    resolvedValues[key] = {
                        code: obj.externalId,
                        id: obj.id,
                        identifier: obj.identifier,
                        name: obj.orgName,
                        parentId: parentValue,
                        type: locationType.school
                    };
                }
            }
            const subRoles = formValues[locationType.subPersona].map((data: any) => {
                return { type: this.userType, subType: data.value }
            });
            // const stateAndDistrict = this.userLocations.filter(
            //     (loc: any) => loc.type === locationType.state || loc.type === locationType.district
            // );
            const { firstName, gender, dob, profileCompleted } = this.profileData ?? {};
            const profileCompletedPercentage = (firstName && gender && dob) ? 100 : (firstName || gender || dob) ? 60 : profileCompleted;
            const payload = {
                params: {},
                request: {
                    userId: this.userId,
                    // profileLocation: [...stateAndDistrict, ...Object.values(resolvedValues)]
                    profileLocation: [...Object.values(resolvedValues)],
                    profileUserTypes: subRoles,
                    profileCompleted: profileCompletedPercentage
                }
            }
            const updatedProfileData = { ...resolvedValues, [locationType.subPersona] : subRoles };
            await this.loader.showLoading('LOADER_MSG');
            this.locationService.updateProfile(payload).pipe(
                finalize(() => this.loader.dismissLoading())
            ).subscribe(
                (res: any) => {
                    this.encryptionService.encryptAndLog(res);
                    this.updateLocalProfileData(updatedProfileData);
                    this.toastService.presentToast('LOCATION_UPDATE_SUCCESSFULLY', 'success');
                },
                (err: any) => {
                    this.toastService.presentToast(err?.error?.message, 'danger');
                }
            );
        } else {
            this.formLib?.myForm.markAllAsTouched();
            this.toastService.presentToast('FORM_REQUIRED_FIELDS_ERROR', 'danger');
        }
    }

    // Updates the localStorage profileData with the latest block, cluster, and school values
    async updateLocalProfileData(resolvedValues: any) {
        const updatableKeys = Object.values(locationType) || [];
        const updatedData: any = {};
        for (const key of updatableKeys) {
            if (key === locationType.subPersona) {
                updatedData["role"] = resolvedValues[key].map((role: any) => role.subType).join(',');
                continue;
            }
            if (resolvedValues[key]) {
                updatedData[key] = {
                    id: resolvedValues[key].id || '',
                    name: resolvedValues[key].name || resolvedValues[key].orgName || '',
                    code: resolvedValues[key].code || resolvedValues[key].externalId || ''
                };
            }
        }

        localStorage.setItem('profileData', JSON.stringify(updatedData));
        const options = { type:"refreshData" };
        let response = await this.utilService.postMessageListener(options)
        if(!response){
            console.log("No refresh needed")
        }
    }

    goBack() {
        this.navCtrl.back();
    }
}
