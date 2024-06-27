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
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    SlAuthLibModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
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
    SwUpdate
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
