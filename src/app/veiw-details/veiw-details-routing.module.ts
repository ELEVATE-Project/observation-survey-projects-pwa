import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VeiwDetailsPage } from './veiw-details.page';

const routes: Routes = [
  {
    path: '',
    component: VeiwDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VeiwDetailsPageRoutingModule {}
