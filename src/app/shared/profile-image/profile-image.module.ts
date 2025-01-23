import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileImagePageRoutingModule } from './profile-image-routing.module';

import { ProfileImagePage } from './profile-image.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileImagePageRoutingModule,
    TranslateModule
  ],
  declarations: [ProfileImagePage],
  exports: [ProfileImagePage]

})
export class ProfileImagePageModule {}
