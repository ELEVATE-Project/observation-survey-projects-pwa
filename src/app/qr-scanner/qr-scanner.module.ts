import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrScannerPageRoutingModule } from './qr-scanner-routing.module';

import { QrScannerPage } from './qr-scanner.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [QrScannerPage]
})
export class QrScannerPageModule {}
