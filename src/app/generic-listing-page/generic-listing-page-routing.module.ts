import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenericListingPageComponent } from './generic-listing-page.component';
import { listingConfig } from '../config/listingPageConfig';

const routes: Routes = [
  {
    path: 'explore',
    component: GenericListingPageComponent,
    data: listingConfig.explore
  },
  {
    path: 'saved',
    component: GenericListingPageComponent,
    data: listingConfig.saved
  },
  {
    path: 'recommended',
    component: GenericListingPageComponent,
    data: listingConfig.recommendations
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericListingPageRoutingModule {}
