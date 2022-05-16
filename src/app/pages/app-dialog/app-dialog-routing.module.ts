import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppDialogPage } from './app-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: AppDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDialogPageRoutingModule {}
