import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaListPage } from './agenda-list.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaListPageRoutingModule {}
