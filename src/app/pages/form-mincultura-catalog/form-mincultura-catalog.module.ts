import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormMinculturaCatalogPageRoutingModule } from './form-mincultura-catalog-routing.module';

import { FormMinculturaCatalogPage } from './form-mincultura-catalog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormMinculturaCatalogPageRoutingModule
  ],
  declarations: [FormMinculturaCatalogPage]
})
export class FormMinculturaCatalogPageModule {}
