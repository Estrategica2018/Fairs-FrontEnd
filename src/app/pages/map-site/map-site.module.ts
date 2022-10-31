import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapSitePageRoutingModule } from './map-site-routing.module';
import { MapSitePage } from './map-site.page';
import { ComponentsModule } from '../../components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MapSitePageRoutingModule
  ],
  declarations: [MapSitePage]
})
export class MapSitePageModule {}
