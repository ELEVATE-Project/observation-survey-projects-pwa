import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LIBRARY_CONFIG, SlAuthLibModule } from 'authentication_frontend_library';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    SlAuthLibModule
  ],
  providers: [{ provide:RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: LIBRARY_CONFIG,
      useFactory: configFactory,
      deps: [HttpClient]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function configFactory(http: HttpClient): any {
  return http.get('assets/config/library-config.json');
}
