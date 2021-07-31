import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WompiPaymentLayoutPage } from './wompi-payment-layout.page';

const routes: Routes = [
  {
    path: '',
    component: WompiPaymentLayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WompiPaymentLayoutPageRoutingModule {}
