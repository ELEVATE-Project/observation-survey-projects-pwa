import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReflectionPageRoutingModule } from './reflection-routing.module';
import { ReflectionPage } from './reflection.page';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, IonicModule, ReflectionPageRoutingModule, SharedModule, TranslateModule, MatIconModule],
  declarations: [ReflectionPage],
})
export class ProjectPageModule {}
