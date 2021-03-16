import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPavilionStandsPageRoutingModule } from './map-pavilion-stands-routing.module';

import { MapPavilionStandsPage } from './map-pavilion-stands.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPavilionStandsPageRoutingModule
  ],
  declarations: [MapPavilionStandsPage]
})
export class MapPavilionStandsPageModule {}
