import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminPage } from './admin';
import { AdminPageRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AdminPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [AdminPage],
  entryComponents: [AdminPage],
})
export class AdminModule {}
