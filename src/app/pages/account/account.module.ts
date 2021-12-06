import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components.module';
import { AccountPage } from './account';
import { AccountPageRoutingModule } from './account-routing.module';
import { LoginComponent } from '../login/login.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    AccountPageRoutingModule
  ],
  declarations: [
    AccountPage,
  ],
  entryComponents: [
    LoginComponent
  ]
})
export class AccountModule { }
