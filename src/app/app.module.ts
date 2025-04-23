import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LIBRARY_CONFIG, SlAuthLibModule } from 'authentication_frontend_library';
import { ApiInterceptor } from './services/interceptor/api.interceptor';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { of, switchMap } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CertificateVerificationPopoverComponent } from './shared/certificate-verification-popover/certificate-verification-popover.component';
import { ShareLinkPopupComponent } from './shared/share-link-popup/share-link-popupcomponent';
import { ShortUrlPipe } from './shared/pipes/short-url.pipe';

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RedirectionHandlerComponent } from './redirection-handler/redirection-handler.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { FormsService } from 'formstore-cache';

export function translateHttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent,CertificateVerificationPopoverComponent,ShareLinkPopupComponent,ShortUrlPipe,RedirectionHandlerComponent,PageNotFoundComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    SlAuthLibModule, BrowserAnimationsModule,SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [{ provide:RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: LIBRARY_CONFIG,
      useFactory: configFactory,
      deps: [HttpClient]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    SwUpdate,
    ShortUrlPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  formsConfig={
    BASEURL:environment.baseURL,
    db:{
      dbName:"forms",
      dbVersion:1,
      storeName:"forms",
    }
  }
  constructor(private translate:TranslateService,private formsService:FormsService){
    this.setLanguage();
    this.formsService.setFormsConfig(this.formsConfig);

  }
  setLanguage() {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}

export function configFactory(http: HttpClient): any {
  return http.get("/assets/config/library-config.json").pipe(switchMap((data:any)=>{
    data.baseUrl = environment.baseURL
    return of(data)
  }))
}
