import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportListPageRoutingModule } from './report-list-routing.module';

import { ReportListPage } from './report-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportListPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [ReportListPage]
})
export class ReportListPageModule {}
