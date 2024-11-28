import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyImprovementsListingPageRoutingModule } from './my-improvements-listing-routing.module';

import { MyImprovementsListingPage } from './my-improvements-listing.page';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyImprovementsListingPageRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [MyImprovementsListingPage]
})
export class MyImprovementsListingPageModule {}
