import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverflowPage } from './overflow.page';

const routes: Routes = [
  {
    path: '',
    component: OverflowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverflowPageRoutingModule {}
