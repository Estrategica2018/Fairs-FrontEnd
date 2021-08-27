import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapEditorPageRoutingModule } from './map-editor-routing.module';
import { MapEditorPage } from './map-editor.page';
import { PanelEditorComponent } from './panel-editor/panel-editor.component';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { ComponentModule } from '../../../components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DragAndDropModule,
    MapEditorPageRoutingModule,
    ComponentModule
  ],
  declarations: [MapEditorPage, PanelEditorComponent], 
  entryComponents: [PanelEditorComponent]
})
export class MapEditorPageModule {}
