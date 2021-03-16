import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PavilionPageRoutingModule } from './pavilion-routing.module';

import { PavilionPage } from './pavilion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PavilionPageRoutingModule
  ],
  declarations: [PavilionPage]
})
export class PavilionPageModule {}
