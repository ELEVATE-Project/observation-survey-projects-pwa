import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyReportRoutingModule } from './survey-report-routing.module';
import { SurveyReportDetailsComponent } from './survey-report-details/survey-report-details.component';


@NgModule({
  declarations: [SurveyReportDetailsComponent],
  imports: [
    CommonModule,
    SurveyReportRoutingModule
  ]
})
export class SurveyReportModule { }
