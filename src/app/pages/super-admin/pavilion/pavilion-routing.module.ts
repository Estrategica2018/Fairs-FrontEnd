import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PavilionPage } from './pavilion.page';

const routes: Routes = [
  {
    path: '',
    component: PavilionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PavilionPageRoutingModule {}
