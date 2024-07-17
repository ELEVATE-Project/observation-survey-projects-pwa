import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProjectPageRoutingModule } from './add-project-routing.module';

import { AddProjectPage } from './add-project.page';
import { DynamicFormModule } from 'dynamic-form-farhan';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicFormModule,
    AddProjectPageRoutingModule
  ],
  declarations: [AddProjectPage]

})
export class AddProjectPageModule {}
