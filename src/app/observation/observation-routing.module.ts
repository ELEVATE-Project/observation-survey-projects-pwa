import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../services/guard/guard.service';
import { ObservationComponent } from './observation.component';

const routes: Routes = [
  {
    path:'',
    component:ObservationComponent,
    canDeactivate: [GuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservationRoutingModule { }