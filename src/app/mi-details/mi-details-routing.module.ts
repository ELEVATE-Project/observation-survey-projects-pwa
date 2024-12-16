import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiDetailsPage } from './mi-details.page';
import { AddProblemStatementPage } from './add-problem-statement/add-problem-statement.page';
import { ViewDetailsPage } from './view-details/view-details.page';

const routes: Routes = [
  {
    path: ':id',
    component: MiDetailsPage
  },
  {
    path: 'add-problem-statement/:id',
    component: AddProblemStatementPage
  },
  {
    path:'view-details',
    component:ViewDetailsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiDetailsPageRoutingModule {}
