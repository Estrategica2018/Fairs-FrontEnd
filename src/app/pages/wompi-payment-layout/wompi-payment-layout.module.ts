import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WompiPaymentLayoutPageRoutingModule } from './wompi-payment-layout-routing.module';

import { WompiPaymentLayoutPage } from './wompi-payment-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WompiPaymentLayoutPageRoutingModule
  ],
  declarations: [WompiPaymentLayoutPage]
})
export class WompiPaymentLayoutPageModule {}
