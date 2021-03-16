import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPavilionPageRoutingModule } from './map-pavilion-routing.module';

import { MapPavilionPage } from './map-pavilion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPavilionPageRoutingModule
  ],
  declarations: [MapPavilionPage]
})
export class MapPavilionModule {}
