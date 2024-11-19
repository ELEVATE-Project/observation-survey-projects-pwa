import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObservationComponent } from './observation.component';
import { GuardService } from '../services/guard/guard.service';

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
