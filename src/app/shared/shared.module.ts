import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RecommendationCardComponent } from './recommendation-card/recommendation-card.component';
import { BottomNavigationComponent } from './bottom-navigation/bottom-navigation.component';
import { PopoverComponent } from './popover/popover.component';
import { ShareLinkPopupComponent } from './share-link-popup/share-link-popupcomponent';
import { ShortUrlPipe } from './pipes/short-url.pipe';

@NgModule({
    declarations: [
        RecommendationCardComponent,
        BottomNavigationComponent,
        PopoverComponent,
        ShareLinkPopupComponent,
        ShortUrlPipe
    ],
    imports: [CommonModule, IonicModule, TranslateModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        RecommendationCardComponent,
        BottomNavigationComponent,
        PopoverComponent,
        ShareLinkPopupComponent
    ],
    providers: [ShortUrlPipe]
})
export class SharedModule {}
