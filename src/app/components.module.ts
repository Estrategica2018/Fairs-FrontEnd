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
import { SideMenuButtonsComponent } from './pages/super-admin/map-site-editor/side-menu-buttons/side-menu-buttons.component';
import { ShowColorComponent } from './pages/super-admin/product/show-color/show-color.component';
import { AgendaCatalogComponent } from './pages/map/agenda-catalog/agenda-catalog.component';
import { FormCatalogComponent } from './pages/map/form-catalog/form-catalog.component';
import { SpeakerCatalogComponent } from './pages/map/speaker-catalog/speaker-catalog.component';
import { SpeakerAdminDetailComponent } from './pages/super-admin/speaker/speaker-admin-detail/speaker-admin-detail.component';
import { SceneSiteComponent } from './pages/map-site/scene-site/scene-site.component';

import { TermsPage } from './pages/terms/terms.page';
import { SpeakerListComponent } from './pages/super-admin/map-editor/speaker-list/speaker-list.component';
import { AgendaListComponent } from './pages/super-admin/map-editor/agenda-list/agenda-list.component';
import { AgendaComponent } from './pages/agenda/agenda-component/agenda.component';

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
    SideMenuButtonsComponent,
    ShowColorComponent,
    TermsPage,
    AgendaCatalogComponent,
    FormCatalogComponent,
    SpeakerCatalogComponent,
    SpeakerAdminDetailComponent,
    SceneSiteComponent,
    SpeakerListComponent,
    AgendaListComponent,
    AgendaComponent
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
    SideMenuButtonsComponent,
    ShowColorComponent,
    TermsPage,
    AgendaCatalogComponent,
    FormCatalogComponent,
    SpeakerCatalogComponent,
    SpeakerAdminDetailComponent,
    SceneSiteComponent,
    SpeakerListComponent,
    AgendaListComponent,
    AgendaComponent
  ]

})

export class ComponentsModule {
  constructor() {

  }
}