import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenericListingPageComponent } from './generic-listing-page.component';
import { listingConfig } from '../config/listingPageConfig';
import { MyImprovementsListingPage } from './my-improvements-listing/my-improvements-listing.page';
import { SpotlightListingPage } from './spotlight-listing/spotlight-listing.page';

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
    path: 'recommendations',
    component: GenericListingPageComponent,
    data: listingConfig.recommendations
  },
  {
    path: 'my-improvements',
    component: MyImprovementsListingPage
  },
  {
    path: 'spotlight',
    component: SpotlightListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericListingPageRoutingModule {}
