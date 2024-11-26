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
  declarations: [GenericListingPageComponent]
})
export class GenericListingPageModule {}
