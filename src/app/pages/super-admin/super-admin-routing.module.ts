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
    path: 'categories-subcategories',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },

  {
    path: 'speaker',
    loadChildren: () => import('./speaker/speaker.module').then( m => m.SpeakerPageModule)
  },
  {
    path: 'agenda/:agendaId',
    loadChildren: () => import('./agenda/agenda.module').then( m => m.AgendaPageModule)
  },
  {
    path: 'map-editor/fair',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  //<-- Map Site Editor
  {
    path: 'map-site-editor/fair/template/:template',
    loadChildren: () => import('./map-site-editor/map-site-editor.module').then( m => m.MapSiteEditorPageModule)
  },
  {
    path: 'map-site-editor/fair/:sceneId',
    loadChildren: () => import('./map-site-editor/map-site-editor.module').then( m => m.MapSiteEditorPageModule)
  },
  {
    path: 'map-site-editor/pavilion/:sceneId',
    loadChildren: () => import('./map-site-editor/map-site-editor.module').then( m => m.MapSiteEditorPageModule)
  },
  // Map Site Editor -->
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
    path: 'map-editor/product/:pavilionId/:standId/:productId',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  {
    path: 'map-editor/product/:pavilionId/:standId/:productId/:sceneId',
    loadChildren: () => import('./map-editor/map-editor.module').then( m => m.MapEditorPageModule)
  },
  {
    path: 'merchant',
    loadChildren: () => import('./merchant/merchant.module').then( m => m.MerchantPageModule)
  },
  {
    path: 'merchant/update/:merchantId',
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
  },
  {
    path: 'map-site-editor',
    loadChildren: () => import('./map-site-editor/map-site-editor.module').then( m => m.MapSiteEditorPageModule)
  },
  {
    path: 'agenda-list',
    loadChildren: () => import('./agenda-list/agenda-list.module').then( m => m.AgendaListPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminPageRoutingModule {}
