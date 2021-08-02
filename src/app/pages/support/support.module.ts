import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SupportPage } from './support';
import { SocialMediaComponent } from '../social-media/social-media.component';
import { SupportPageRoutingModule } from './support-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SupportPageRoutingModule
  ],
  declarations: [
    SupportPage,SocialMediaComponent
  ]
})
export class SupportModule { }
