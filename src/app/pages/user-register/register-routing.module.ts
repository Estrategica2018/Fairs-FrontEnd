import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterPage } from './register';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  },
  {
    path: 'register',
    loadChildren: () => import('./register.module').then( m => m.RegisterPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterPageRoutingModule { }
