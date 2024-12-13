import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VeiwDetailsPageRoutingModule } from './veiw-details-routing.module';

import { VeiwDetailsPage } from './veiw-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VeiwDetailsPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [VeiwDetailsPage]
})
export class VeiwDetailsPageModule {}
