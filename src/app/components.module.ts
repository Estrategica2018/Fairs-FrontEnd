import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabMenuScenesComponent } from './pages/tab-menu-scenes/tab-menu-scenes.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    TabMenuScenesComponent
  ],
  exports: [
    TabMenuScenesComponent
  ]
  
})

export class ComponentModule {
    constructor() {
        
    }
}