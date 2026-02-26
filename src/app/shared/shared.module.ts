import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PopUpComponent } from './pop-up/pop-up.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';



@NgModule({
  declarations: [HeaderComponent,PopUpComponent, ProfileInfoComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ]
  , exports: [HeaderComponent, ProfileInfoComponent]
})
export class SharedModule { }
