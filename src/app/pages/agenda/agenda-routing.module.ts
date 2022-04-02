import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgendaPage } from './agenda';

const routes: Routes = [
  {
    path: '',
    component: AgendaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaPageRoutingModule { }
