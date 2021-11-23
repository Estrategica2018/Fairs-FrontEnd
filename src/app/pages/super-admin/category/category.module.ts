import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoryPageRoutingModule } from './category-routing.module';
import { CategoryPage } from './category.page';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    NgPipesModule,
  ],
  declarations: [CategoryPage],
  entryComponents: []
})
export class CategoryPageModule {}
