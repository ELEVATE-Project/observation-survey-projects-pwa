import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericReportComponent } from './generic-report.component';

const routes: Routes = [
  {
    path:'',
    component:GenericReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenericReportRoutingModule { }
