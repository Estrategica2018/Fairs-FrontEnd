import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { ComponentModule } from './components.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { WompiPaymentLayoutPageModule } from './pages/wompi-payment-layout/wompi-payment-layout.module';
//import { APP_BASE_HREF } from '@angular/common';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    WompiPaymentLayoutPageModule,
    ComponentModule
  ],
  declarations: [AppComponent],
  entryComponents: [],
  providers: [
    InAppBrowser, 
    SplashScreen, 
    StatusBar, 
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    Title,
    //{provide: APP_BASE_HREF, useValue: 'http://'+window.location.hostname+'/Fair-website/'}
    
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
    
    constructor() {
    }
}

