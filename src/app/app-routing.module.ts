import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'map/fair/0',
    pathMatch: 'full'
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.ScheduleModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'recoverPassword',
    loadChildren: () => import('./pages/recover/password.module').then(m => m.PasswordModule)
  },
  {
    path: 'recoverPassword/:token',
    loadChildren: () => import('./pages/recover/password.module').then(m => m.PasswordModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
    //canLoad: [CheckTutorial]
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./pages/super-admin/super-admin.module').then( m => m.SuperAdminPageModule)
  },
  {
    path: 'map/fair/:sceneId',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'payment/:referenceId',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'speakers',
    loadChildren: () => import('./pages/speaker-list/speaker-list.module').then(m => m.SpeakerListModule)
  },
  {
    path: 'speakers/speaker-details/:speakerId',
    loadChildren: () => import('./pages/speaker-detail/speaker-detail.module').then(m => m.SpeakerDetailModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'wompi-payment-layout',
    loadChildren: () => import('./pages/wompi-payment-layout/wompi-payment-layout.module').then( m => m.WompiPaymentLayoutPageModule)
  },
  {
    path: 'overflow',
    loadChildren: () => import('./pages/overflow/overflow.module').then( m => m.OverflowPageModule)
  },
  {
    path: 'shopping-cart',
    loadChildren: () => import('./pages/shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule)
  },
  {
    path: 'agenda/:agendaId',
    loadChildren: () => import('./pages/agenda/agenda.module').then( m => m.AgendaPageModule)
  },
  {
    path: 'app-dialog/:dialogType/:email',
    loadChildren: () => import('./pages/app-dialog/app-dialog.module').then( m => m.AppDialogPageModule)
  },
  {
    path: 'map-site/fair/:sceneId',
    loadChildren: () => import('./pages/map-site/map-site.module').then( m => m.MapSitePageModule)
  },
  {
    path: 'map-site/pavilion/:pavilionId/:sceneId',
    loadChildren: () => import('./pages/map-site/map-site.module').then( m => m.MapSitePageModule)
  },
  {
    path: 'map-site/stand/:pavilionId/:standId/:sceneId',
    loadChildren: () => import('./pages/map-site/map-site.module').then( m => m.MapSitePageModule)
  },
  {
    path: 'map-site/product/:pavilionId/:standId/:productId/:sceneId',
    loadChildren: () => import('./pages/map-site/map-site.module').then( m => m.MapSitePageModule)
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
