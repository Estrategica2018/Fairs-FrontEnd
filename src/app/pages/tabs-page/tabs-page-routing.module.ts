import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';



const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
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
        redirectTo: '/app/tabs/about',
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

