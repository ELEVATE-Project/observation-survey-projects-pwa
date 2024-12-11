import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyJourneysListingPageRoutingModule } from './my-journeys-listing-routing.module';

import { MyJourneysListingPage } from './my-journeys-listing.page';
import { SharedModule } from '../shared/shared.module';
import { MyJourneyPage } from './my-journey/my-journey.page';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyJourneysListingPageRoutingModule,
    SharedModule,
    MatIconModule,
    TranslateModule
  ],
  declarations: [MyJourneysListingPage,MyJourneyPage]
})
export class MyJourneysListingPageModule {}
