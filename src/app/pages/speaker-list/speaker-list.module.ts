import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SpeakerListPage } from './speaker-list';
import { SpeakerListPageRoutingModule } from './speaker-list-routing.module';
import { ComponentsModule } from '../../components.module';
import { SpeakerDetailComponent } from './speaker-detail/speaker-detail.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SpeakerListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SpeakerListPage],
  entryComponents: [
    SpeakerDetailComponent
  ]
})
export class SpeakerListModule {}
