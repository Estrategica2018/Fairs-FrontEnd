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
import { ScheduleDetailComponent } from './pages/schedule/schedule-detail/schedule-detail.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { AccountComponent } from './pages/account/account.component';
import { TermsPage } from './pages/terms/terms.page';

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
    ShoppingCartComponent,
    ScheduleDetailComponent,
    SignupComponent,
    LoginComponent,
    AccountComponent,
    TermsPage
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
    ShoppingCartComponent,
    ScheduleDetailComponent,
    SignupComponent,
    LoginComponent,
    AccountComponent,
    TermsPage
  ]
  
})

export class ComponentsModule {
    constructor() {
        
    }
}