import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectReportPage } from './project-report.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectReportPageRoutingModule {}
