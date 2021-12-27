import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapPage } from './map';
import { MapPageRoutingModule } from './map-routing.module';
import { ComponentsModule } from '../../components.module';
import { ProductDetailComponent } from '../product-catalog/product-detail/product-detail.component';
import { SpeakerDetailComponent } from '../speaker-list/speaker-detail/speaker-detail.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart-component/shopping-cart-component';
import { ScheduleDetailComponent } from '../schedule/schedule-detail/schedule-detail.component';
import { LoginComponent } from '../login/login.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    MapPageRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MapPage
  ],
  entryComponents: [
    ProductDetailComponent, SpeakerDetailComponent, ShoppingCartComponent, LoginComponent, ScheduleDetailComponent
  ]
})
export class MapModule { }
