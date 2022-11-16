import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-banner-setting-panel',
  templateUrl: './banner-setting-panel.component.html',
  styleUrls: ['./banner-setting-panel.component.scss'],
})
export class BannerSettingPanelComponent implements OnInit {

  @Input() banner: any;
  @Input() internalUrlList: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() onCopyBanner = new EventEmitter<any>();
  @Output() changeItem = new EventEmitter<any>();
  @Output() deleteBanner = new EventEmitter<any>();

  fixedBannerPanel = false;
  panelPos: any = { x: '27px', y: '0px' };
  tabSelect = 'position';
  positionTypes = [{ "value": "relative", "label": "Relativo", "selected": true }, { "value": "absolute", "label": "Absolute" }, { "value": "float", "label": "Flotante" }];
  triangleBorderStyles = [{ "value": "solid", "label": "Sólido", "selected": true },
  { "value": "dashed", "label": "dashed" },
  { "value": "dotted", "label": "dotted" },
  { "value": "double", "label": "double" },
  { "value": "groove", "label": "groove" },
  { "value": "inset", "label": "inset" },
  { "value": "ridge", "label": "ridge" }];
  carouselOptionList = ['slidesPerView', 'rotate', 'stretch', 'depth', 'modifier'];
  fontFamilyList = [
    { 'label': 'Gill Sans Extrabold', 'value': '"Gill Sans Extrabold", Helvetica, sans-serif' },
    { 'label': 'Lucida Console', 'value': 'Courier, "Lucida Console", monospace' },
    { 'label': 'YoutubeSansMedium', 'value': 'YoutubeSansMedium' },
    { 'label': 'YoutubeSansBold', 'value': 'YoutubeSansBold' },
    { 'label': 'YoutubeSansLight', 'value': 'YoutubeSansLight' },
    { 'label': 'Sans-Serif Arial', 'value': '"Sans-Serif", Arial, sans-serif' },
    { 'label': 'Sans-Serif Helvetica', 'value': '"Sans-Serif", Helvetica, sans-serif' },
    { 'label': 'Times New Roman', 'value': '"Times New Roman", Times, serif' },
    { 'label': 'Arial', 'value': 'Arial, sans-serif' },
    { 'label': 'Brush Script MT', 'value': '"Brush Script MT", cursive' },
    { 'label': 'Georgia', 'value': 'Georgia, serif' },
    { 'label': 'Gill Sans', 'value': '"Gill Sans", serif' },
    { 'label': 'Helvetica Narrow', 'value': '"Helvetica Narrow", sans-serif' }
  ];
  lineTypes = [{ "value": "dashed", "label": "Cortada" }, { "value": "solid", "label": "Sólida" }, { "value": "dotted", "label": "Punteada" }, { "value": "double", "label": "Doble" }, { "value": "groove", "label": "Sombreada" }]
  fontWeightList = ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'bold', 'bolder', 'inherit', 'initial', 'lighter', 'normal', 'revert', 'unset'];
  textAligns = [{ "value": "center", "label": "Centrado" }, { "value": "justify", "label": "Justificado" }, { "value": "right", "label": "Derecha" }, { "value": "left", "label": "Izquierda" }];
  toolTipArrowStyles = [{ "label": "Arrow Up", "value": "arrow--1" }, { "label": "Array left", "value": "arrow--2" }, { "label": "Arrow Down", "value": "arrow--3" }, { "label": "Arrow right", "value": "arrow--4" },
  { "label": "Arrow Up Inside", "value": "arrow--5" }, { "label": "Array left Inside", "value": "arrow--6" }, { "label": "Arrow Down Inside", "value": "arrow--7" }, { "label": "Arrow right Inside", "value": "arrow--8" }];
  borderStyles = [
    { "label": "none", "value": "none" },
    { "label": "dashed", "value": "dashed" },
    { "label": "solid", "value": "solid" },
    { "label": "double", "value": "double" },
    { "label": "groove", "value": "groove" },
    { "label": "ridge", "value": "ridge" },
    { "label": "inset", "value": "inset" },
    { "label": "outset", "value": "outset" }];

  hoverEffects = [{ "name": "GirarDerecha", "isChecked": false }, { "name": "GirarIzquierda", "isChecked": false }];
  showProductCatalogActions = null;
  showSpeakerCatalogActions = null;
  tabMenuObj: any;
  showPanelTool = null;


  constructor(
    private sanitizer: DomSanitizer,
    private alertCtrl: AlertController
  ) {


  }

  ngOnInit() {

  }

  onCloseClick() {
    if (this.onClose) this.onClose.emit();
  }

  onChangeOpacity() {
    const originYRange: any = document.querySelector<HTMLElement>('.origin-y-range');
    this.banner.styles = this.banner.styles || {};
    this.banner.styles.opacity = originYRange.value / 100;
    this.goToOnChangeItem();
  }

  goToOnChangeItem() {
    if (this.changeItem) {
      this.changeItem.emit(true);
    }
  }

  goToOnChangeItemFloat() {
    if (this.changeItem) {
      this.changeItem.emit(true);
    }
  }

  onChangeItemColor() {
    this.goToOnChangeItem();
  }

  onToogleBannerPanel() {
    this.fixedBannerPanel = !this.fixedBannerPanel;
    if (this.fixedBannerPanel) {
      const main = document.querySelector<HTMLElement>('ion-router-outlet');
      const panel = document.querySelector<HTMLElement>('.panel-scene-select');
      this.panelPos.x = (main.offsetWidth - panel.offsetWidth - 100) + 'px';
      this.panelPos.y = '0';
    }
  }

  onChangeItem() {
    this.goToOnChangeItem();
  }

  onChangeVideoUrl() {
    this.onChangeItem();
    this.banner.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(this.banner.video.url);
  }

  onChangeCarousel() {
    this.onChangeItem();
    //this.onResizeCarousels();
  }

  presentActionAddCarrousel() {

  }

  doReorderCarousel($event) {

  }

  onOpenChangeImg(image, images, i) {
  }
  onDeleteCarretImg(image, carousel, strg, i) {
  }
  onChangeEffect(effect) {
  }

  onChangeItemTextLineHeight(obj, unit, mili) {

    console.log('onChangeItemTextLineHeight');
    if (!obj[mili]) {
      obj[mili] = 1;
      obj[unit] = 1;
    }

    if (!obj[unit]) {
      obj[unit] = 0;
    }

    if (obj[mili] > 9) {
      obj[mili] = 0;
      obj[unit]++;
    }
    else if (obj.lineHeightMili < 0) {
      obj.lineHeightMili = 9;
      obj[unit]--;
    }


  }

  onClickOpenHtml(banner, str) {

  }

  goToOnCopyBanner(itemList) {
    if (this.onCopyBanner) this.onCopyBanner.emit(itemList);
  }


  async presenterDeleteScene(banner) {
    const alert = await this.alertCtrl.create({
      message: 'Confirma para eliminar el objeto ' + banner.type,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            if (this.deleteBanner) {
              this.onCloseClick();
              this.deleteBanner.emit(banner);
            }
          }
        }
      ]
    });
    await alert.present();
  }


}
