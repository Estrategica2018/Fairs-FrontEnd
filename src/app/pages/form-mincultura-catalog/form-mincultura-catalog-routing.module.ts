import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormMinculturaCatalogPage } from './form-mincultura-catalog.page';

const routes: Routes = [
  {
    path: '',
    component: FormMinculturaCatalogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormMinculturaCatalogPageRoutingModule {}
