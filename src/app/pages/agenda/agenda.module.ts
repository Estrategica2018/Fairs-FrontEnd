import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaPage } from './agenda';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AgendaPageRoutingModule
  ],
  declarations: [
    AgendaPage,
  ]
})
export class AgendaModule { }
