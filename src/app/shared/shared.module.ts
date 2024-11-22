import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RecommendationCardComponent } from './recommendation-card/recommendation-card.component';
import { BottomNavigationComponent } from './bottom-navigation/bottom-navigation.component';
import { PopoverComponent } from './popover/popover.component';
import { ShareLinkPopupComponent } from './share-link-popup/share-link-popupcomponent';
import { ShortUrlPipe } from './pipes/short-url.pipe';
import { SpotlightCardComponent } from './spotlight-card/spotlight-card.component';
import { MyimprovementCardComponent } from './myimprovement-card/myimprovement-card.component';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    declarations: [
        RecommendationCardComponent,
        BottomNavigationComponent,
        PopoverComponent,
        ShareLinkPopupComponent,
        ShortUrlPipe,
        SpotlightCardComponent,
        MyimprovementCardComponent
    ],
    imports: [CommonModule, IonicModule, TranslateModule,MatIconModule,MatDividerModule,MatButtonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        RecommendationCardComponent,
        BottomNavigationComponent,
        PopoverComponent,
        ShareLinkPopupComponent,
        SpotlightCardComponent,
        MyimprovementCardComponent
    ],
    providers: [ShortUrlPipe]
})
export class SharedModule {}
