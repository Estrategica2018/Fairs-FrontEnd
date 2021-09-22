import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabMenuScenesComponent } from './pages/map/tab-menu-scenes/tab-menu-scenes.component';
import { CarouselTemplateComponent } from './pages/map/carousel-template/carousel-template.component';
import { SceneComponent } from './pages/scene/scene.component';
import { ProductCatalogComponent } from './pages/product-catalog/product-catalog.component';
import { CarouselImagesComponent } from './pages/product-catalog/carousel-images/carousel-images.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    TabMenuScenesComponent,
    CarouselTemplateComponent,
    SceneComponent,
    ProductCatalogComponent,
    CarouselImagesComponent
  ],
  exports: [
    TabMenuScenesComponent,
    CarouselTemplateComponent,
    SceneComponent,
    ProductCatalogComponent,
    CarouselImagesComponent
  ]
  
})

export class ComponentModule {
    constructor() {
        
    }
}