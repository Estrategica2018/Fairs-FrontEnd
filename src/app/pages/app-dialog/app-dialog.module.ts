import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppDialogPageRoutingModule } from './app-dialog-routing.module';

import { AppDialogPage } from './app-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppDialogPageRoutingModule
  ],
  declarations: [AppDialogPage]
})
export class AppDialogPageModule {}
