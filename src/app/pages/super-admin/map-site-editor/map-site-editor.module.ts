import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { IonicModule } from '@ionic/angular';
import { MapSiteEditorPageRoutingModule } from './map-site-editor-routing.module';
import { MapSiteEditorPage } from './map-site-editor.page';
import { SceneComponent } from './scene-component/scene.component';
import { LayoutComponent } from './layout-component/layout.component';
import { BannerSettingPanelComponent } from './banner-setting-panel/banner-setting-panel.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
	DragAndDropModule,
    MapSiteEditorPageRoutingModule
  ],
  declarations: [MapSiteEditorPage, SceneComponent, LayoutComponent, BannerSettingPanelComponent],
  entryComponents: [SceneComponent, LayoutComponent, BannerSettingPanelComponent]
})
export class MapSiteEditorPageModule {}
