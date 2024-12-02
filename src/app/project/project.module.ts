import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectPageRoutingModule } from './project-routing.module';

import { ProjectDetailsPage } from './project-details.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProjectPageRoutingModule, SharedModule],
  declarations: [ProjectDetailsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectPageModule {}
