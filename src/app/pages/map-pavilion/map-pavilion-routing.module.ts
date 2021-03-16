import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapPavilionPage } from './map-pavilion.page';

const routes: Routes = [
  {
    path: '',
    component: MapPavilionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapPavilionPageRoutingModule {}
