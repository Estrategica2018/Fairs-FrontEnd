import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { IonicModule } from '@ionic/angular';
import { MapSiteEditorPageRoutingModule } from './map-site-editor-routing.module';
import { MapSiteEditorPage } from './map-site-editor.page';
import { ComponentsModule } from '../../../components.module';
import { LayoutComponent } from './layout-component/layout.component';
import { BannerSettingPanelComponent } from './banner-setting-panel/banner-setting-panel.component';
import { NgxPopperModule } from 'ngx-popper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DragAndDropModule,
    ComponentsModule,
    MapSiteEditorPageRoutingModule,
    NgxPopperModule.forRoot({
      hideOnClickOutside: false
    })
  ],
  declarations: [MapSiteEditorPage, LayoutComponent, BannerSettingPanelComponent],
  entryComponents: [LayoutComponent, BannerSettingPanelComponent]
})
export class MapSiteEditorPageModule {}
