import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaListPageRoutingModule } from './agenda-list-routing.module';

import { AgendaListPage } from './agenda-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaListPageRoutingModule
  ],
  declarations: [AgendaListPage]
})
export class AgendaListPageModule {}
