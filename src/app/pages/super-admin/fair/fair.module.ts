import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FairPageRoutingModule } from './fair-routing.module';

import { FairPage } from './fair.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FairPageRoutingModule
  ],
  declarations: [FairPage]
})
export class FairPageModule {}
