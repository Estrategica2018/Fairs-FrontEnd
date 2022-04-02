import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule, Title } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { WompiPaymentLayoutPageModule } from './pages/wompi-payment-layout/wompi-payment-layout.module';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart-component/shopping-cart-component';
import { SignupComponent } from './pages/signup/signup.component';
import { AccountComponent } from './pages/account/account.component';
import { LoginComponent } from './pages/login/login.component';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, "es");
import { RouteReuseStrategy } from '@angular/router';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    WompiPaymentLayoutPageModule,
    ComponentsModule
  ],
  declarations: [AppComponent],
  entryComponents: [ ShoppingCartComponent, LoginComponent, SignupComponent, AccountComponent ],
  providers: [
    InAppBrowser, 
    SplashScreen, 
    StatusBar, 
    DatePipe,
    //{provide: LocationStrategy, useClass: HashLocationStrategy},
	{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Title,
    { provide: LOCALE_ID, useValue: "es" }
    //{provide: APP_BASE_HREF, useValue: 'http://'+window.location.hostname+'/Fair-website/'}    
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
    
    constructor() {
    }
}

