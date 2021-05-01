import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { AgendaPage } from './agenda.page';
import { SpeakersSelectPage } from '../speakers-select/speakers-select.page';
import { AudienceSelectPage } from '../audience-select/audience-select.page';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,
	NgPipesModule,	
  ],
  declarations: [AgendaPage, SpeakersSelectPage, AudienceSelectPage],
  entryComponents: [SpeakersSelectPage, AudienceSelectPage]
})
export class AgendaPageModule {}
