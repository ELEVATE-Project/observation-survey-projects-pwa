import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenericReportRoutingModule } from './generic-report-routing.module';
import { SanitizeUrlPipe } from './pipes/sanitize-url.pipe';
import { GenericReportComponent } from './generic-report.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [GenericReportComponent,SanitizeUrlPipe],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    IonicModule,
    
    GenericReportRoutingModule
  ]
})
export class GenericReportModule { }
