import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavePageRoutingModule } from './save-routing.module';

import { SavePage } from './save.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavePageRoutingModule,
    SharedModule
  ],
  declarations: [SavePage]
})
export class SavePageModule {}
