import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FairPageRoutingModule } from './fair-routing.module';
import { FairPage } from './fair.page';
import { NewSceneComponent } from './new-scene/new-scene.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FairPageRoutingModule
  ],
  declarations: [FairPage, NewSceneComponent],
  entryComponents: [ NewSceneComponent ],
})
export class FairPageModule {}
