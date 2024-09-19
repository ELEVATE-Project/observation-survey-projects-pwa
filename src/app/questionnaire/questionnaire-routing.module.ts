import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { GuardService } from '../services/guard/guard.service';

const routes: Routes = [
  {
    path:'',
    component:QuestionnaireComponent,
    canDeactivate: [GuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
