import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionDetailPage } from './session-detail';
import { SessionDetailPageRoutingModule } from './session-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components.module';
import { SpeakerDetailComponent } from '../speaker-list/speaker-detail/speaker-detail.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    SessionDetailPageRoutingModule
  ],
  declarations: [
    SessionDetailPage,
  ],
  entryComponents: [
    SpeakerDetailComponent
  ]
})
export class SessionDetailModule { }
