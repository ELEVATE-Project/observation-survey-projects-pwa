import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyJourneysListingPage } from './my-journeys-listing.page';
import { MyJourneyPage } from './my-journey/my-journey.page';

const routes: Routes = [
  {
    path: '',
    component: MyJourneysListingPage
  },
  {
    path: ':id',
    component:MyJourneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyJourneysListingPageRoutingModule {}
