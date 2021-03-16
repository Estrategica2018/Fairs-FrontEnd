import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StandPage } from './stand.page';

const routes: Routes = [
  {
    path: '',
    component: StandPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StandPageRoutingModule {}
