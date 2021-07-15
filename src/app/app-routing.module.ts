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
  {	 path: 'map/pavilion1/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/pavilion2/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/pavilion3/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/pavilion4/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/pavilion5/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/pavilion6/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/pavilion7/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/pavilion8/:pavilionId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand1/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand2/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand3/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand4/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand5/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand6/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand7/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {	 path: 'map/stand8/:pavilionId/:standId/:sceneId',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
  },
  {
	path: 'meeting/:meetingId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/meeting/meeting.module').then( m => m.MeetingPageModule)
	  }
	]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
