import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { AgendaPage } from './agenda.page';
import { SpeakersSelectPage } from '../speakers-select/speakers-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,
	
  ],
  declarations: [AgendaPage, SpeakersSelectPage],
  entryComponents: [SpeakersSelectPage]
})
export class AgendaPageModule {}
