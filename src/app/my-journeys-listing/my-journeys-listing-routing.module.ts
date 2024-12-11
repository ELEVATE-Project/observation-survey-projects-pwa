import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyJourneysListingPage } from './my-journeys-listing.page';
import { MyJourneyPage } from './my-journey/my-journey.page';

const routes: Routes = [
  {
    path: 'my-journeys',
    component: MyJourneysListingPage
  },
  {
    path: 'my-journey/:id',
    component:MyJourneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyJourneysListingPageRoutingModule {}
