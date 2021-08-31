import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPricePageRoutingModule } from './product-price-routing.module';
import { ProductPricePage } from './product-price.page';
import { ImagenListComponent } from '../imagen-list/imagen-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPricePageRoutingModule
  ],
  declarations: [
    ProductPricePage,
    ImagenListComponent
  ],
  entryComponents: [
    ImagenListComponent
  ]
})
export class ProductPricePageModule {}
