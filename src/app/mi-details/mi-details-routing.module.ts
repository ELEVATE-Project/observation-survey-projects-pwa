import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiDetailsPage } from './mi-details.page';

const routes: Routes = [
  {
    path: '',
    component: MiDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiDetailsPageRoutingModule {}
