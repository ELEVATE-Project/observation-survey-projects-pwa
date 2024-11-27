import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiDetailsPageRoutingModule } from './mi-details-routing.module';

import { MiDetailsPage } from './mi-details.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [MiDetailsPage]
})
export class MiDetailsPageModule {}
