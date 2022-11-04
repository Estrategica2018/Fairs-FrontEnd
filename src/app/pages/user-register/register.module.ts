import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgPipesModule } from 'ngx-pipes';
import { RegisterPageRoutingModule } from './register-routing.module';
import {RegisterPage} from './register';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterPageRoutingModule,
    NgPipesModule
  ],
  declarations: [RegisterPage],
})
export class RegisterPageModule {}
