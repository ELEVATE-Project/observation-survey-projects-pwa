import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectReportPageRoutingModule } from './project-report-routing.module';

import { ProjectReportPage } from './project-report.page';
import { PopoverComponent } from '../shared/popover/popover.component';
import { ReportHeaderComponent } from '../shared/report-header/report-header.component';
import { CertificateVerificationPopoverComponent } from '../shared/certificate-verification-popover/certificate-verification-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectReportPageRoutingModule
  ],
  declarations: [ProjectReportPage,PopoverComponent,ReportHeaderComponent,CertificateVerificationPopoverComponent]
})
export class ProjectReportPageModule {}
