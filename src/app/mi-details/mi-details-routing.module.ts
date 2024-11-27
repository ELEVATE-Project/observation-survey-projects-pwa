import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiDetailsPage } from './mi-details.page';

const routes: Routes = [
  {
    path: '',
    component: MiDetailsPage
  },
  {
    path: 'add-problem-statement',
    loadChildren: () => import('../add-problem-statement/add-problem-statement.module').then( m => m.AddProblemStatementPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiDetailsPageRoutingModule {}
