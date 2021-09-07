import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverflowPageRoutingModule } from './overflow-routing.module';

import { OverflowPage } from './overflow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverflowPageRoutingModule
  ],
  declarations: [OverflowPage]
})
export class OverflowPageModule {}
