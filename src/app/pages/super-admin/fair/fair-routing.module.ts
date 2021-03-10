import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FairPage } from './fair.page';

const routes: Routes = [
  {
    path: '',
    component: FairPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FairPageRoutingModule {}
