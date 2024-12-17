import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReflectionPage } from './reflection.page';

const routes: Routes = [
  {
    path: '',
    component: ReflectionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReflectionPageRoutingModule {}
