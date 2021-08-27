import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabMenuScenesComponent } from './pages/map/tab-menu-scenes/tab-menu-scenes.component';
import { CarouselTemplateComponent } from './pages/map/carousel-template/carousel-template.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    TabMenuScenesComponent,CarouselTemplateComponent
  ],
  exports: [
    TabMenuScenesComponent,CarouselTemplateComponent
  ]
  
})

export class ComponentModule {
    constructor() {
        
    }
}