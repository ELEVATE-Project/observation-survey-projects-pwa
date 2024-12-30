import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiDetailsPage } from './mi-details.page';
import { AddProblemStatementPage } from './add-problem-statement/add-problem-statement.page';
import { RecommendationDetailsPage } from './recommendation-details/recommendation-details.page';

const routes: Routes = [
  {
    path: ':id',
    component: MiDetailsPage
  },
  {
    path: 'recommendation/:id',
    component: RecommendationDetailsPage
  },
  {
    path: 'add-problem-statement/:id',
    component: AddProblemStatementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiDetailsPageRoutingModule {}
