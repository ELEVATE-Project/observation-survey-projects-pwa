import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyImprovementsListingPage } from './my-improvements-listing.page';


const routes: Routes = [
  {
    path: '',
    component: MyImprovementsListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyImprovementsListingPageRoutingModule {}
