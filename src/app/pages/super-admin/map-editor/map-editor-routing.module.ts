import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapEditorPage } from './map-editor.page';

const routes: Routes = [
  {
    path: '',
    component: MapEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapEditorPageRoutingModule {}
