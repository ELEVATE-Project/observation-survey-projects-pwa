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

@NgModule({
  declarations: [AppComponent,CertificateVerificationPopoverComponent,ShareLinkPopupComponent,ShortUrlPipe],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    SlAuthLibModule, BrowserAnimationsModule,
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
  bootstrap: [AppComponent],
})
export class AppModule {}

export function configFactory(http: HttpClient): any {
  return http.get("../assets/config/library-config.json").pipe(switchMap((data:any)=>{
    data.baseUrl = environment.baseURL
    return of(data)
  }))
}
