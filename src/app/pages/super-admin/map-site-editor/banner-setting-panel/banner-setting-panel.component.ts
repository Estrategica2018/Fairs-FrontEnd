import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-banner-setting-panel',
  templateUrl: './banner-setting-panel.component.html',
  styleUrls: ['./banner-setting-panel.component.scss'],
})
export class BannerSettingPanelComponent implements OnInit {

  @Input() banner: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() onChangeItem = new EventEmitter<any>();
  fixedBannerPanel = false;
  panelPos: any = { x: '27px', y: '0px' };
  
  positionTypes = [{"value":"relative","label":"Relativo","selected":true},{"value":"absolute","label":"Absolute"}];
  
  constructor() { }

  ngOnInit() {
	  
  }

  onCloseClick() {
	if(this.onClose) this.onClose.emit();
  }

  onChangeOpacity() {
      const originYRange : any= document.querySelector<HTMLElement>('.origin-y-range');
	  this.banner.style = this.banner.style || {};
      this.banner.style.opacity = originYRange.value / 100;
  }
  
  goToOnChangeItem() {
    if(this.onChangeItem) this.onChangeItem.emit();
  }
  
  onChangeItemColor() {
	this.goToOnChangeItem();
  }

  onToogleBannerPanel() {
    this.fixedBannerPanel = !this.fixedBannerPanel;
    if(this.fixedBannerPanel) {
       const main = document.querySelector<HTMLElement>('ion-router-outlet');
       const panel = document.querySelector<HTMLElement>('.panel-scene-select');
       this.panelPos.x = ( main.offsetWidth - panel.offsetWidth - 100 ) + 'px';
       this.panelPos.y = '0';
    }
  }

}

