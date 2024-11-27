import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProblemStatementPage } from './add-problem-statement.page';

const routes: Routes = [
  {
    path: '',
    component: AddProblemStatementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProblemStatementPageRoutingModule {}
