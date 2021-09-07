import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
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
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./pages/super-admin/super-admin.module').then( m => m.SuperAdminPageModule)
  },
  {
    path: 'map/fair/:sceneId',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'map/fair1/:sceneId',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'map/fair2/:sceneId',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'map/fair3/:sceneId',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'map/fair4/:sceneId',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'map/fair5/:sceneId',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion1/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion2/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion3/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion4/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion5/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion6/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion7/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/pavilion8/:pavilionId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand1/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand2/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand3/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand4/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand5/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand6/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand7/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {     path: 'map/stand8/:pavilionId/:standId/:sceneId',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
  },
  {
    path: 'meeting/:meetingId',
    loadChildren: () => import('./pages/meeting/meeting.module').then( m => m.MeetingPageModule)
  },  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'speakers',
    loadChildren: () => import('./pages/speaker-list/speaker-list.module').then(m => m.SpeakerListModule)
  },
  {
    path: 'speakers/session/:sessionId',
    loadChildren: () => import('./pages/session-detail/session-detail.module').then(m => m.SessionDetailModule)
  },
  {
    path: 'speakers/speaker-details/:speakerId',
    loadChildren: () => import('./pages/speaker-detail/speaker-detail.module').then(m => m.SpeakerDetailModule)
  },
  {
    path: 'schedule/session/:sessionId',
    loadChildren: () => import('./pages/session-detail/session-detail.module').then(m => m.SessionDetailModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then( m => m.NewsPageModule)
  },  {
    path: 'wompi-payment-layout',
    loadChildren: () => import('./pages/wompi-payment-layout/wompi-payment-layout.module').then( m => m.WompiPaymentLayoutPageModule)
  },
  {
    path: 'product-catalog',
    loadChildren: () => import('./pages/product-catalog/product-catalog.module').then( m => m.ProductCatalogPageModule)
  },
  {
    path: 'product-detail/:pavilionId/:standId/:productId',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'overflow',
    loadChildren: () => import('./pages/overflow/overflow.module').then( m => m.OverflowPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
