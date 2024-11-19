import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservationRoutingModule } from './observation-routing.module';
import { ObservationComponent } from './observation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ObservationComponent],
  imports: [
    CommonModule,
    ObservationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class ObservationModule { }
