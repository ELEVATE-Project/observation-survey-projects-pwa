import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadListPageRoutingModule } from './download-list-routing.module';

import { DownloadListPage } from './download-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule
    TranslateModule
  ],
  declarations: [DownloadListPage]
})
export class DownloadListPageModule {}
