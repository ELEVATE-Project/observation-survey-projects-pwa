import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { GenericListingPageComponent } from './generic-listing-page.component';
import { SharedModule } from '../shared/shared.module';
import { GenericListingPageRoutingModule } from './generic-listing-page-routing.module';
import { MyImprovementsListingPage } from './my-improvements-listing/my-improvements-listing.page';
import { SpotlightListingPage } from './spotlight-listing/spotlight-listing.page';
import { MyJourneyPage } from '../my-journeys-listing/my-journey/my-journey.page';
import { MyJourneysListingPage } from '../my-journeys-listing/my-journeys-listing.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    TranslateModule,
    MatCardModule,
    SharedModule,
    GenericListingPageRoutingModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [GenericListingPageComponent,MyImprovementsListingPage,SpotlightListingPage,MyJourneysListingPage,MyJourneyPage]
})
export class GenericListingPageModule {}
