import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileEditPage } from './profile-edit.page';
import { GuardService } from '../services/guard/guard.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileEditPage,
    // canDeactivate: [GuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileEditPageRoutingModule {}
