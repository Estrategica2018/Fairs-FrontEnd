import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapStandPageRoutingModule } from './map-stand-routing.module';

import { MapStandPage } from './map-stand.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapStandPageRoutingModule
  ],
  declarations: [MapStandPage]
})
export class MapStandPageModule {}
