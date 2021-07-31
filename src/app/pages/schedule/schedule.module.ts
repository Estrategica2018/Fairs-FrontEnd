import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import { WompiPaymentLayoutPage } from './../wompi-payment-layout/wompi-payment-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule
  ],
  declarations: [
    SchedulePage,
    ScheduleFilterPage,
    WompiPaymentLayoutPage
  ],
  entryComponents: [
    ScheduleFilterPage,
    WompiPaymentLayoutPage
  ]
})
export class ScheduleModule { }
