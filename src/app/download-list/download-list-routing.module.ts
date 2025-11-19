import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadListPage } from './download-list.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadListPageRoutingModule {}
