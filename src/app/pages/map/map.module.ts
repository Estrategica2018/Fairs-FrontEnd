import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapPage } from './map';
import { MapPageRoutingModule } from './map-routing.module';
import { ComponentsModule } from '../../components.module';
import { ProductDetailComponent } from '../product-catalog/product-detail/product-detail.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    MapPageRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MapPage
  ],
  entryComponents: [
    ProductDetailComponent
  ]
})
export class MapModule { }
