import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { CertificateListingPage } from '../certificate-listing/certificate-listing.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
   {
    path: 'certificate',
    component:CertificateListingPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
