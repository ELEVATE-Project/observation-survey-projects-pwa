import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationUpdatePageRoutingModule } from './location-update-routing.module';

import { LocationUpdatePage } from './location-update.page';
import { DynamicFormModule } from 'elevate-dynamic-form';
import { ProfileImagePageModule } from '../shared/profile-image/profile-image.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LocationUpdatePageRoutingModule,
        DynamicFormModule,
        ProfileImagePageModule,
        TranslateModule,
        SharedModule
    ],
    declarations: [LocationUpdatePage]
})
export class LocationUpdatePageModule { }
