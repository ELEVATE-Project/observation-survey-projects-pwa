import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PopUpComponent } from './pop-up/pop-up.component';



@NgModule({
  declarations: [HeaderComponent,PopUpComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ]
  , exports: [HeaderComponent]
})
export class SharedModule { }
