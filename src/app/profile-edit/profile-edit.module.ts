import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileEditPageRoutingModule } from './profile-edit-routing.module';

import { ProfileEditPage } from './profile-edit.page';
import { DynamicFormModule } from 'elevate-dynamic-form';
import { ProfileImagePageModule } from "../shared/profile-image/profile-image.module";

@NgModule({
    declarations: [ProfileEditPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfileEditPageRoutingModule,
        DynamicFormModule,
        ProfileImagePageModule
    ]
})
export class ProfileEditPageModule {}
