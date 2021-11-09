import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ComponentsModule } from '../../components.module';
import { SchedulePageRoutingModule } from './schedule-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SchedulePageRoutingModule
  ],
  declarations: [
    SchedulePage, ScheduleFilterPage
  ],
  entryComponents: [
    ScheduleFilterPage
  ]
})
export class ScheduleModule { }