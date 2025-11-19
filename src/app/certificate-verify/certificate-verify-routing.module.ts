import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificateVerifyPage } from './certificate-verify.page';

const routes: Routes = [
  {
    path: '',
    component: CertificateVerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificateVerifyPageRoutingModule {}
