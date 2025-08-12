import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CertificateVerifyPageRoutingModule } from './certificate-verify-routing.module';

import { CertificateVerifyPage } from './certificate-verify.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    CertificateVerifyPageRoutingModule
  ],
  declarations: [CertificateVerifyPage]
})
export class CertificateVerifyPageModule {}
