import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapSiteEditorPage } from './map-site-editor.page';

const routes: Routes = [
  {
    path: '',
    component: MapSiteEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapSiteEditorPageRoutingModule {}
