import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PasswordPage } from './password';
import { PasswordPageRoutingModule } from './password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordPageRoutingModule
  ],
  declarations: [
    PasswordPage,
  ]
})
export class PasswordModule { }
