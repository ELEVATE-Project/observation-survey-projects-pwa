import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProblemStatementPageRoutingModule } from './add-problem-statement-routing.module';

import { AddProblemStatementPage } from './add-problem-statement.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProblemStatementPageRoutingModule,
    SharedModule
  ],
  declarations: [AddProblemStatementPage]
})
export class AddProblemStatementPageModule {}
