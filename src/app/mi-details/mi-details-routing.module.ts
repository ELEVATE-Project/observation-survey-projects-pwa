import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiDetailsPage } from './mi-details.page';
import { AddProblemStatementPage } from '../add-problem-statement/add-problem-statement.page';

const routes: Routes = [
  {
    path: '',
    component: MiDetailsPage
  },
  {
    path: 'add-problem-statement',
    component: AddProblemStatementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiDetailsPageRoutingModule {}
