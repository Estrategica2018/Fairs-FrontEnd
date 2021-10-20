import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabMenuScenesComponent } from './pages/map/tab-menu-scenes/tab-menu-scenes.component';
import { CarouselTemplateComponent } from './pages/map/carousel-template/carousel-template.component';
import { SceneComponent } from './pages/scene/scene.component';
import { CarouselImagesComponent } from './pages/product-catalog/carousel-images/carousel-images.component';
import { ProductDetailComponent } from './pages/product-catalog/product-detail/product-detail.component';
import { BannerComponent } from './pages/map/banner/banner.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TabMenuScenesComponent,
    CarouselTemplateComponent,
    SceneComponent,
    CarouselImagesComponent,
    ProductDetailComponent,
    BannerComponent
  ],
  exports: [
    TabMenuScenesComponent,
    CarouselTemplateComponent,
    SceneComponent,
    CarouselImagesComponent,
    ProductDetailComponent,
    BannerComponent
  ]
  
})

export class ComponentsModule {
    constructor() {
        
    }
}