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
    path: 'pavilion',
    loadChildren: () => import('./pavilion/pavilion.module').then( m => m.PavilionPageModule)
  },
  {
    path: 'stand/:pavilionId/:standId',
    loadChildren: () => import('./stand/stand.module').then( m => m.StandPageModule)
  },
  {
    path: 'stand/:pavilionId',
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
    path: 'map-editor/fair',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  {
    path: 'map-editor/fair/:sceneId',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },  
  {
    path: 'map-editor/pavilion/:pavilionId',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  {
    path: 'map-editor/pavilion/:pavilionId/:sceneId',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  {
    path: 'map-editor/stand/:pavilionId/:standId',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  {
    path: 'map-editor/stand/:pavilionId/:standId/:sceneId',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  {
    path: 'merchant',
    loadChildren: () => import('./merchant/merchant.module').then( m => m.MerchantPageModule)
  },
  {
    path: 'product/:pavilionId/:standId',
    loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'product/:pavilionId/:standId/:productId',
    loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'product-price/:pavilionId/:standId/:productId',
    loadChildren: () => import('./product-price/product-price.module').then( m => m.ProductPricePageModule)
  },
  {
    path: 'product-price/:pavilionId/:standId/:productId/:productPriceId',
    loadChildren: () => import('./product-price/product-price.module').then( m => m.ProductPricePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminPageRoutingModule {}
