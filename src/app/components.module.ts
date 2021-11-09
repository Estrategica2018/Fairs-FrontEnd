import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabMenuScenesComponent } from './pages/map/tab-menu-scenes/tab-menu-scenes.component';
import { CarouselTemplateComponent } from './pages/map/carousel-template/carousel-template.component';
import { SceneComponent } from './pages/scene/scene.component';
import { CarouselSlidesComponent } from './pages/product-catalog/carousel-slides/carousel-slides.component';
import { ProductDetailComponent } from './pages/product-catalog/product-detail/product-detail.component';
import { BannerComponent } from './pages/map/banner/banner.component';
import { SpeakerDetailComponent } from './pages/speaker-list/speaker-detail/speaker-detail.component';
import { BannerEditorComponent } from './pages/super-admin/map-editor/banner-editor/banner-editor.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart-component/shopping-cart-component';

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
    CarouselSlidesComponent,
    ProductDetailComponent,
    BannerComponent,
    SpeakerDetailComponent,
    BannerEditorComponent,
    ShoppingCartComponent
  ],
  exports: [
    TabMenuScenesComponent,
    CarouselTemplateComponent,
    SceneComponent,
    CarouselSlidesComponent,
    ProductDetailComponent,
    BannerComponent,
    SpeakerDetailComponent,
    BannerEditorComponent,
    ShoppingCartComponent
  ]
  
})

export class ComponentsModule {
    constructor() {
        
    }
}