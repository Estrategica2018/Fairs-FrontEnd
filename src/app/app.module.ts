import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule, Title } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe,CurrencyPipe } from '@angular/common';
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
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as Cloudinary from "cloudinary-core";
import {
  CloudinaryModule,
  CloudinaryConfiguration
} from "@cloudinary/angular-5.x";



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
    ComponentsModule,
    NgScrollbarModule,
    MatTooltipModule,
    CloudinaryModule.forRoot(Cloudinary, {
      cloud_name: "demo" //specify cloud_name
    } as CloudinaryConfiguration)
  ],
  declarations: [AppComponent],
  entryComponents: [ ShoppingCartComponent, LoginComponent, SignupComponent, AccountComponent ],
  providers: [
    DatePipe,
    CurrencyPipe,
    //{provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Title,
    { provide: LOCALE_ID, useValue: "es" }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
    
    constructor() {
    }
}

