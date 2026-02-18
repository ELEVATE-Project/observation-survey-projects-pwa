import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AllowTemplateViewDirective } from '../shared/directives/allow-template-view.directive';
import { ImageComponent } from '../shared/image/image.component';
import { WebviewHomeComponent } from './webview-home/webview-home.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule,
    TranslateModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomePage, AllowTemplateViewDirective,ImageComponent, WebviewHomeComponent]
})
export class HomePageModule {}
