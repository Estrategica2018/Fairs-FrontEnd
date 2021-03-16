import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'meeting/:meetingId',
        children: [
          {
            path: '',
            loadChildren: () => import('../meeting/meeting.module').then(m => m.MeetingPageModule)
          }
        ]
      },
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: SchedulePage,
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          }
        ]
      },
      {
        path: 'speakers',
        children: [
          {
            path: '',
            loadChildren: () => import('../speaker-list/speaker-list.module').then(m => m.SpeakerListModule)
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          },
          {
            path: 'speaker-details/:speakerId',
            loadChildren: () => import('../speaker-detail/speaker-detail.module').then(m => m.SpeakerDetailModule)
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapModule)
          }
        ]
      },
      {
        path: 'maps/pavilion-stands/:pavilionId/:sceneId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion-stands/map-pavilion-stands.module').then(m => m.MapPavilionStandsPageModule)
          }
        ]
      },
      {
        path: 'maps/pavilion1/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion2/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion3/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion4/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion5/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion6/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion7/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion8/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion9/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
        path: 'maps/pavilion10/:pavilionId',
        children: [
          {
            path: '',
            loadChildren: () => import('../map-pavilion/map-pavilion.module').then(m => m.MapPavilionModule)
          }
        ]
      },
      {
         path: 'maps/stand/:pavilionId/:standId',
         loadChildren: () => import('../map-stand/map-stand.module').then( m => m.MapStandPageModule)
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        path: 'news',
        loadChildren: () => import('../news/news.module').then( m => m.NewsPageModule)
      },
      {
        path: 'library',
        loadChildren: () => import('../library/library.module').then( m => m.LibraryPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('../history/history.module').then( m => m.HistoryPageModule)
      },
      {
        path: 'memories',
        loadChildren: () => import('../memories/memories.module').then( m => m.MemoriesPageModule)
      },
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

