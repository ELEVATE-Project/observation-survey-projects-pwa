import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PAGE_TITLES } from 'src/app/core/constants/pageTitles';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
    private lastKey: string | null = null;
    private langSub?: Subscription;

    constructor(private titleService: Title, private translate: TranslateService) {
        this.langSub = this.translate.onLangChange.subscribe(() => {
        if (this.lastKey) this.applyKey(this.lastKey);
        });
    }

    setTitleByKey(key: string) {
        this.lastKey = key;
        this.applyKey(key);
    }

    private applyKey(key: string) {
        this.translate.get(key).subscribe((translated: string) => {
        if (translated) {
            this.titleService.setTitle(translated);
        }
        });
    }

    setTitleForType(type: string) {
        let key = (PAGE_TITLES as any)[`${type}List`] || `Listing`;
        this.setTitleByKey(key);
    }

    ngOnDestroy() {
        this.langSub?.unsubscribe();
    }
}
