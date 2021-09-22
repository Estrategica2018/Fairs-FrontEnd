import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SpeakerListPage } from './speaker-list';
import { SpeakerListPageRoutingModule } from './speaker-list-routing.module';
import { SpeakerDetailComponent } from './speaker-detail/speaker-detail.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SpeakerListPageRoutingModule
  ],
  declarations: [SpeakerListPage,SpeakerDetailComponent],
  entryComponents: [
    SpeakerDetailComponent
  ]
})
export class SpeakerListModule {}
