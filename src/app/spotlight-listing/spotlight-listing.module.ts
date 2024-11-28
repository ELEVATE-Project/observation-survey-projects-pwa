import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpotlightListingPageRoutingModule } from './spotlight-listing-routing.module';
import { SpotlightListingPage } from './spotlight-listing.page';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpotlightListingPageRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [SpotlightListingPage]
})
export class SpotlightListingPageModule {}
