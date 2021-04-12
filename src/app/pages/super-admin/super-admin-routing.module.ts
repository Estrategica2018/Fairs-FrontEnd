import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperAdminPage } from './super-admin.page';

const routes: Routes = [
  {
    path: 'fair',
    loadChildren: () => import('./fair/fair.module').then( m => m.FairPageModule)
  },
  {
    path: 'pavilion/:pavilionId',
    loadChildren: () => import('./pavilion/pavilion.module').then( m => m.PavilionPageModule)
  },
  {
    path: 'stand/:pavilionId/:standId',
    loadChildren: () => import('./stand/stand.module').then( m => m.StandPageModule)
  },
  {
    path: 'agenda',
    loadChildren: () => import('./agenda/agenda.module').then( m => m.AgendaPageModule)
  },
  {
    path: 'agenda/:agendaId',
    loadChildren: () => import('./agenda/agenda.module').then( m => m.AgendaPageModule)
  },
  {
    path: 'speakers-select',
    loadChildren: () => import('./speakers-select/speakers-select.module').then( m => m.SpeakersSelectPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminPageRoutingModule {}
