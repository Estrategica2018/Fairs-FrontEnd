import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MapPage } from './map';
import { MapPageRoutingModule } from './map-routing.module';
import { ComponentModule } from '../../components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MapPageRoutingModule,
    ComponentModule
  ],
  declarations: [
    MapPage
  ],
  entryComponents: [
    
  ]
})
export class MapModule { }
