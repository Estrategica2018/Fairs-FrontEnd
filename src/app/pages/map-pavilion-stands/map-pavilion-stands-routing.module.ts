import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapPavilionStandsPage } from './map-pavilion-stands.page';

const routes: Routes = [
  {
    path: '',
    component: MapPavilionStandsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapPavilionStandsPageRoutingModule {}
