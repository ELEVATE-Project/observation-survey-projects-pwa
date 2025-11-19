import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectReportPageRoutingModule } from './project-report-routing.module';

import { ProjectReportPage } from './project-report.page';
import { PopoverComponent } from '../shared/popover/popover.component';
import { ReportHeaderComponent } from '../shared/report-header/report-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectReportPageRoutingModule,
    TranslateModule,SharedModule
  ],
  declarations: [ProjectReportPage,PopoverComponent,ReportHeaderComponent]
})
export class ProjectReportPageModule {}
