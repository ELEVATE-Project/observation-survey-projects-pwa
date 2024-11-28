import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpotlightListingPage } from './spotlight-listing.page';

const routes: Routes = [
  {
    path: '',
    component: SpotlightListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpotlightListingPageRoutingModule {}
