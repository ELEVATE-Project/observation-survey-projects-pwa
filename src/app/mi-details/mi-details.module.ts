import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiDetailsPageRoutingModule } from './mi-details-routing.module';

import { MiDetailsPage } from './mi-details.page';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddProblemStatementPage } from './add-problem-statement/add-problem-statement.page';
import { RecommendationDetailsPage } from './recommendation-details/recommendation-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiDetailsPageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MiDetailsPage,AddProblemStatementPage, RecommendationDetailsPage]
})
export class MiDetailsPageModule {}
