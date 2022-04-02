import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-banner-setting-panel',
  templateUrl: './banner-setting-panel.component.html',
  styleUrls: ['./banner-setting-panel.component.scss'],
})
export class BannerSettingPanelComponent implements OnInit {

  @Input() banner: any;
  @Input() internalUrlList: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() changeItem = new EventEmitter<any>();
  @Output() deleteBanner = new EventEmitter<any>();
  fixedBannerPanel = false;
  panelPos: any = { x: '27px', y: '0px' };
  tabSelect = 'position';
  positionTypes = [{"value":"relative","label":"Relativo","selected":true},{"value":"absolute","label":"Absolute"}];
  carouselOptionList = ['slidesPerView','rotate','stretch','depth','modifier'];  
    fontFamilyList = [
    {'label':'Gill Sans Extrabold', 'value':'"Gill Sans Extrabold", Helvetica, sans-serif'},
    {'label':'Lucida Console', 'value': 'Courier, "Lucida Console", monospace'},
    {'label':'YoutubeSansMedium', 'value': 'YoutubeSansMedium'},
    {'label':'YoutubeSansBold', 'value': 'YoutubeSansBold'},
    {'label':'YoutubeSansLight', 'value': 'YoutubeSansLight'},
    {'label':'Sans-Serif Arial', 'value': '"Sans-Serif", Arial, sans-serif'},
    {'label':'Sans-Serif Helvetica', 'value': '"Sans-Serif", Helvetica, sans-serif'},
    {'label':'Times New Roman', 'value': '"Times New Roman", Times, serif'},
    {'label':'Arial', 'value': 'Arial, sans-serif'},
    {'label':'Brush Script MT', 'value': '"Brush Script MT", cursive'},
    {'label':'Georgia', 'value': 'Georgia, serif'},
    {'label':'Gill Sans', 'value': '"Gill Sans", serif'},
    {'label':'Helvetica Narrow', 'value': '"Helvetica Narrow", sans-serif'}
  ];
  lineTypes = [{"value":"dashed","label":"Cortada"},{"value":"solid","label":"Sólida"},{"value":"dotted","label":"Punteada"},{"value":"double","label":"Doble"},{"value":"groove","label":"Sombreada"},{"value":"hidden","label":"Oculta"},]
  fontWeightList = ['100','200','300','400','500','600','700','800','900','bold','bolder','inherit','initial','lighter','normal','revert','unset'];
  textAligns = [{"value":"center","label":"Centrado"},{"value":"justify","label":"Justificado"},{"value":"right","label":"Derecha"},{"value":"left","label":"Izquierda"}];
  toolTipArrowStyles = [{"label":"Arrow Up","value":"arrow--1"},{"label":"Array left","value":"arrow--2"},{"label":"Arrow Down","value":"arrow--3"},{"label":"Arrow right","value":"arrow--4"},
                        {"label":"Arrow Up Inside","value":"arrow--5"},{"label":"Array left Inside","value":"arrow--6"},{"label":"Arrow Down Inside","value":"arrow--7"},{"label":"Arrow right Inside","value":"arrow--8"}];
  borderStyles = ["none","dotted","dashed","solid","double","groove","ridge","inset","outset","hidden"];
  hoverEffects = [ {"name":"GirarDerecha","isChecked":false},{"name":"GirarIzquierda","isChecked":false}];
  showProductCatalogActions = null;
  showSpeakerCatalogActions = null;
  tabMenuObj:any;
  showPanelTool = null;
  
  constructor(private sanitizer: DomSanitizer) { }

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
    if(this.changeItem) this.changeItem.emit(null);
  }
  
  goToOnDeleteBanner(banner) {
    if(this.deleteBanner) this.deleteBanner.emit(banner);
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

  onChangeItem() {
	 this.goToOnChangeItem();
  }
  
  onChangeVideoUrl() {
	this.onChangeItem();
    this.banner.video.sanitizer =  this.sanitizer.bypassSecurityTrustResourceUrl(this.banner.video.url);
  }
  
  onChangeCarousel() {
    this.onChangeItem();
    //this.onResizeCarousels();
  }
  
  presentActionAddCarrousel() {
	  
  }
  
  doReorderCarousel($event) {
	  
  }
  
  onOpenChangeImg(image,images,i) {
  }
  onDeleteCarretImg(image,carousel,strg,i){
  }
  onChangeEffect(effect){
  }
  
    onChangeItemTextLineHeight(obj){
      
      if(!obj.lineHeight) { 
         obj.lineHeight = 1;
         obj.lineHeightUnit = 1;
      }
      const mili = Number.parseInt(obj.lineHeight);
      const unit = Number.parseFloat(obj.lineHeight) | 0;
      
      if( obj.lineHeightMili > 9 ) {
           obj.lineHeightMili = 0;
           obj.lineHeightUnit ++;
      }
      else if( obj.lineHeightMili < 0 ) {
           obj.lineHeightMili = 9;
           obj.lineHeightUnit --;
      }
      
      obj.lineHeight = obj.lineHeightUnit + '.' + obj.lineHeightMili;
  }
  
  onClickOpenHtml(banner,str) {
	  
  }
  
  
  
  onCopyBanner(banners){}

}

