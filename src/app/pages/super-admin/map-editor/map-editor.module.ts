import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapEditorPageRoutingModule } from './map-editor-routing.module';
import { MapEditorPage } from './map-editor.page';
import { PanelEditorComponent } from './panel-editor/panel-editor.component';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { ComponentsModule } from '../../../components.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from '../../product-catalog/product-detail/product-detail.component';
import { SpeakerDetailComponent } from '../../speaker-list/speaker-detail/speaker-detail.component';
import { BannerEditorComponent } from './banner-editor/banner-editor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DragAndDropModule,
    MapEditorPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MapEditorPage, PanelEditorComponent,ProductListComponent], 
  entryComponents: [PanelEditorComponent,ProductListComponent,ProductDetailComponent, SpeakerDetailComponent, BannerEditorComponent]
})
export class MapEditorPageModule {}
