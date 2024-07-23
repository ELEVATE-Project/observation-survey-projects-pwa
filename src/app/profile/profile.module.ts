import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { DynamicFormModule } from 'elevate-dynamic-form';
import { ProfileImagePageModule } from "../shared/profile-image/profile-image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    DynamicFormModule,
    ProfileImagePageModule
],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
