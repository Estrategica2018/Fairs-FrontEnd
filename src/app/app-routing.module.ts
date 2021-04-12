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
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'meeting',
    loadChildren: () => import('./pages/meeting/meeting.module').then( m => m.MeetingPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./pages/super-admin/super-admin.module').then( m => m.SuperAdminPageModule)
  },
  {
	path: 'map',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule)
	  }
	]
  },
  {
	path: 'maps/pavilion-stands/:pavilionId/:sceneId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-pavilion-stands/map-pavilion-stands.module').then(m => m.MapPavilionStandsPageModule)
	  }
	]
  },
  {
	path: 'maps/pavilion1/:pavilionId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
	  }
	]
  },
  {
	path: 'maps/pavilion2/:pavilionId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
	  }
	]
  },
  { 
	path: 'maps/pavilion3/:pavilionId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
	  }
	]
  },
  {
	path: 'maps/pavilion4/:pavilionId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
	  }
	]
  },
  {
	path: 'maps/stand1/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand2/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand3/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand4/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand5/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand6/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand7/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand8/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  },
  {
	path: 'maps/stand9/:pavilionId/:standId',
	children: [
	  {
		path: '',
		loadChildren: () => import('./pages/map-stand/map-stand.module').then( m => m.MapStandPageModule)
	  }
	]
  }

    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
