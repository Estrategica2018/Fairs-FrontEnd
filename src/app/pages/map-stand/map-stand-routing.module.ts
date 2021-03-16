import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapStandPage } from './map-stand.page';

const routes: Routes = [
  {
    path: '',
    component: MapStandPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapStandPageRoutingModule {}
