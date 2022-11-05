import { Component, ElementRef, QueryList, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../../api/fairs.service';
import { PavilionsService } from './../../../api/pavilions.service';
import { ProductsService } from './../../../api/products.service';
import { AgendasService } from './../../../api/agendas.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { AdminPavilionsService } from './../../../api/admin/pavilions.service';
import { AdminStandsService } from './../../../api/admin/stands.service';
import { AdminProductsService } from './../../../api/admin/products.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './../../../providers/loading.service';
import { PanelEditorComponent } from './panel-editor/panel-editor.component';
import { AlertController, ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
import { processData, clone } from '../../../providers/process-data';
import { TabMenuScenesComponent } from '../../map/tab-menu-scenes/tab-menu-scenes.component';
import { IonReorderGroup } from '@ionic/angular';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { environment, SERVER_URL } from '../../../../environments/environment';
import { ProductListComponent } from '../../super-admin/map-editor/product-list/product-list.component';
import { AgendaListComponent } from '../../super-admin/map-editor/agenda-list/agenda-list.component';
import { SpeakerListComponent } from '../../super-admin/map-editor/speaker-list/speaker-list.component';
import { SpeakersService } from '../../../api/speakers.service';
import { ProductDetailComponent } from '../../product-catalog/product-detail/product-detail.component';
import { BannerEditorComponent } from './banner-editor/banner-editor.component';
import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common';
import { CategoryService } from './../../../api/category.service';

declare var tinymce;

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.page.html',
  styleUrls: ['./map-editor.page.scss'],
})
export class MapEditorPage implements OnInit {

  url: string;
  @ViewChild('videoMeeting', { static: true }) videoElement: ElementRef;
  @ViewChildren('carrousels') carrousels: any;
  @ViewChildren('carouselSlides') carouselSlides: any;

  @ViewChild('menuTabs', { static: true }) menuTabs: TabMenuScenesComponent;
  number = Number;
  errors = null;
  success = null;
  fixedBannerPanel = true;
  moveMouseEvent: any;
  tabMenuOver = false;
  fullScreen = true;
  showInputClipboard = false;
  tabMenuSelected = null;
  fair = null;
  pavilion = null;
  stand = null;
  product = null;
  bannerSelect = null;
  showTools = null;
  editSave = false;
  editMenuTabSave = false;
  panelPos: any = { x: '27px', y: '0px' };
  mainObj = null;
  resources = null;
  sceneId = null;
  objId = null;
  scene = null;
  template = null;
  showTool = null;
  tabSelect = 'position';
  showPanelTool = null;
  htmlEditor = { obj: null, idType: null };
  isHover = null;
  bannerCopy = [];
  showHtmlEditor = false;
  tabMenuObj: any;
  tabMenuInstance: any = null;
  bannerSelectHover = null;
  hoverEffects = [{ "name": "GirarDerecha", "isChecked": false }, { "name": "GirarIzquierda", "isChecked": false }];
  groupOfLinks = [];
  copyMultiFromList = [];
  selectionElementList = null;
  showSpeakerCatalogActions = '';
  showProductCatalogActions = '';
  historyList = [];
  historySel = -1;
  editModeBackdrop = true;
  bannerSpeakerSelectHover = null;

  borderStyles = ["none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "hidden"];
  toolTipArrowStyles = [{ "label": "Arrow Up", "value": "arrow--1" }, { "label": "Array left", "value": "arrow--2" }, { "label": "Arrow Down", "value": "arrow--3" }, { "label": "Arrow right", "value": "arrow--4" },
  { "label": "Arrow Up Inside", "value": "arrow--5" }, { "label": "Array left Inside", "value": "arrow--6" }, { "label": "Arrow Down Inside", "value": "arrow--7" }, { "label": "Arrow right Inside", "value": "arrow--8" }];
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

  speakerTypeList = [];
  speakerList = [];

  fontWeightList = ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'bold', 'bolder', 'inherit', 'initial', 'lighter', 'normal', 'revert', 'unset'];

  menuIcons = ["accessibility-outline", "add-outline", "add-circle-outline", "airplane-outline", "alarm-outline", "albums-outline", "alert-outline", "alert-circle-outline", "american-football-outline", "analytics-outline", "aperture-outline", "apps-outline", "archive-outline", "arrow-back-outline", "arrow-back-circle-outline", "arrow-down-outline", "arrow-down-circle-outline", "arrow-forward-outline", "arrow-forward-circle-outline", "arrow-redo-outline", "arrow-redo-circle-outline", "arrow-undo-outline", "arrow-undo-circle-outline", "arrow-up-outline", "arrow-up-circle-outline", "at-outline", "at-circle-outline", "attach-outline", "backspace-outline", "bag-outline", "bag-add-outline", "bag-check-outline", "bag-handle-outline", "bag-remove-outline", "balloon-outline", "ban-outline", "bandage-outline", "bar-chart-outline", "barbell-outline", "barcode-outline", "baseball-outline", "basket-outline", "basketball-outline", "battery-charging-outline", "battery-dead-outline", "battery-full-outline", "battery-half-outline", "beaker-outline", "bed-outline", "beer-outline", "bicycle-outline", "bluetooth-outline", "boat-outline", "body-outline", "bonfire-outline", "book-outline", "bookmark-outline", "bookmarks-outline", "bowling-ball-outline", "briefcase-outline", "browsers-outline", "brush-outline", "bug-outline", "build-outline", "bulb-outline", "bus-outline", "business-outline", "cafe-outline", "calculator-outline", "calendar-outline", "calendar-clear-outline", "calendar-number-outline", "call-outline", "camera-outline", "camera-reverse-outline", "car-outline", "car-sport-outline", "card-outline", "caret-back-outline", "caret-back-circle-outline", "caret-down-outline", "caret-down-circle-outline", "caret-forward-outline", "caret-forward-circle-outline", "caret-up-outline", "caret-up-circle-outline", "cart-outline", "cash-outline", "cellular-outline", "chatbox-outline", "chatbox-ellipses-outline", "chatbubble-outline", "chatbubble-ellipses-outline", "chatbubbles-outline", "checkbox-outline", "checkmark-outline", "checkmark-circle-outline", "checkmark-done-outline", "checkmark-done-circle-outline", "chevron-back-outline", "chevron-back-circle-outline", "chevron-down-outline", "chevron-down-circle-outline", "chevron-forward-outline", "chevron-forward-circle-outline", "chevron-up-outline", "chevron-up-circle-outline", "clipboard-outline", "close-outline", "close-circle-outline", "cloud-outline", "cloud-circle-outline", "cloud-done-outline", "cloud-download-outline", "cloud-offline-outline", "cloud-upload-outline", "cloudy-outline", "cloudy-night-outline", "code-outline", "code-download-outline", "code-slash-outline", "code-working-outline", "cog-outline", "color-fill-outline", "color-filter-outline", "color-palette-outline", "color-wand-outline", "compass-outline", "construct-outline", "contract-outline", "contrast-outline", "copy-outline", "create-outline", "crop-outline", "cube-outline", "cut-outline", "desktop-outline", "diamond-outline", "dice-outline", "disc-outline", "document-outline", "document-attach-outline", "document-lock-outline", "document-text-outline", "documents-outline", "download-outline", "duplicate-outline", "ear-outline", "earth-outline", "easel-outline", "egg-outline", "ellipse-outline", "ellipsis-horizontal-outline", "ellipsis-horizontal-circle-outline", "ellipsis-vertical-outline", "ellipsis-vertical-circle-outline", "enter-outline", "exit-outline", "expand-outline", "extension-puzzle-outline", "eye-outline", "eye-off-outline", "eyedrop-outline", "fast-food-outline", "female-outline", "file-tray-outline", "file-tray-full-outline", "file-tray-stacked-outline", "film-outline", "filter-outline", "filter-circle-outline", "finger-print-outline", "fish-outline", "fitness-outline", "flag-outline", "flame-outline", "flash-outline", "flash-off-outline", "flashlight-outline", "flask-outline", "flower-outline", "folder-outline", "folder-open-outline", "football-outline", "footsteps-outline", "funnel-outline", "game-controller-outline", "gift-outline", "git-branch-outline", "git-commit-outline", "git-compare-outline", "git-merge-outline", "git-network-outline", "git-pull-request-outline", "glasses-outline", "globe-outline", "golf-outline", "grid-outline", "hammer-outline", "hand-left-outline", "hand-right-outline", "happy-outline", "hardware-chip-outline", "headset-outline", "heart-outline", "heart-circle-outline", "heart-dislike-outline", "heart-dislike-circle-outline", "heart-half-outline", "help-outline", "help-buoy-outline", "help-circle-outline", "home-outline", "hourglass-outline", "ice-cream-outline", "id-card-outline", "image-outline", "images-outline", "infinite-outline", "information-outline", "information-circle-outline", "invert-mode-outline", "journal-outline", "key-outline", "keypad-outline", "language-outline", "laptop-outline", "layers-outline", "leaf-outline", "library-outline", "link-outline", "list-outline", "list-circle-outline", "locate-outline", "location-outline", "lock-closed-outline", "lock-open-outline", "log-in-outline", "log-out-outline", "magnet-outline", "mail-outline", "mail-open-outline", "mail-unread-outline", "male-outline", "male-female-outline", "man-outline", "map-outline", "medal-outline", "medical-outline", "medkit-outline", "megaphone-outline", "menu-outline", "mic-outline", "mic-circle-outline", "mic-off-outline", "mic-off-circle-outline", "moon-outline", "move-outline", "musical-note-outline", "musical-notes-outline", "navigate-outline", "navigate-circle-outline", "newspaper-outline", "notifications-outline", "notifications-circle-outline", "notifications-off-outline", "notifications-off-circle-outline", "nuclear-outline", "nutrition-outline", "open-outline", "options-outline", "paper-plane-outline", "partly-sunny-outline", "pause-outline", "pause-circle-outline", "paw-outline", "pencil-outline", "people-outline", "people-circle-outline", "person-outline", "person-add-outline", "person-circle-outline", "person-remove-outline", "phone-landscape-outline", "phone-portrait-outline", "pie-chart-outline", "pin-outline", "pint-outline", "pizza-outline", "planet-outline", "play-outline", "play-back-outline", "play-back-circle-outline", "play-circle-outline", "play-forward-outline", "play-forward-circle-outline", "play-skip-back-outline", "play-skip-back-circle-outline", "play-skip-forward-outline", "play-skip-forward-circle-outline", "podium-outline", "power-outline", "pricetag-outline", "pricetags-outline", "print-outline", "prism-outline", "pulse-outline", "push-outline", "qr-code-outline", "radio-outline", "radio-button-off-outline", "radio-button-on-outline", "rainy-outline", "reader-outline", "receipt-outline", "recording-outline", "refresh-outline", "refresh-circle-outline", "reload-outline", "reload-circle-outline", "remove-outline", "remove-circle-outline", "reorder-four-outline", "reorder-three-outline", "reorder-two-outline", "repeat-outline", "resize-outline", "restaurant-outline", "return-down-back-outline", "return-down-forward-outline", "return-up-back-outline", "return-up-forward-outline", "ribbon-outline", "rocket-outline", "rose-outline", "sad-outline", "save-outline", "scale-outline", "scan-outline", "scan-circle-outline", "school-outline", "search-outline", "search-circle-outline", "send-outline", "server-outline", "settings-outline", "shapes-outline", "share-outline", "share-social-outline", "shield-outline", "shield-checkmark-outline", "shield-half-outline", "shirt-outline", "shuffle-outline", "skull-outline", "snow-outline", "sparkles-outline", "speedometer-outline", "square-outline", "star-outline", "star-half-outline", "stats-chart-outline", "stop-outline", "stop-circle-outline", "stopwatch-outline", "storefront-outline", "subway-outline", "sunny-outline", "swap-horizontal-outline", "swap-vertical-outline", "sync-outline", "sync-circle-outline", "tablet-landscape-outline", "tablet-portrait-outline", "telescope-outline", "tennisball-outline", "terminal-outline", "text-outline", "thermometer-outline", "thumbs-down-outline", "thumbs-up-outline", "thunderstorm-outline", "ticket-outline", "time-outline", "timer-outline", "today-outline", "toggle-outline", "trail-sign-outline", "train-outline", "transgender-outline", "trash-outline", "trash-bin-outline", "trending-down-outline", "trending-up-outline", "triangle-outline", "trophy-outline", "tv-outline", "umbrella-outline", "unlink-outline", "videocam-outline", "videocam-off-outline", "volume-high-outline", "volume-low-outline", "volume-medium-outline", "volume-mute-outline", "volume-off-outline", "walk-outline", "wallet-outline", "warning-outline", "watch-outline", "water-outline", "wifi-outline", "wine-outline", "woman-outline", "logo-alipay", "logo-amazon", "logo-amplify", "logo-android", "logo-angular", "logo-apple", "logo-apple-appstore", "logo-apple-ar", "logo-behance", "logo-bitbucket", "logo-bitcoin", "logo-buffer", "logo-capacitor", "logo-chrome", "logo-closed-captioning", "logo-codepen", "logo-css3", "logo-designernews", "logo-deviantart", "logo-discord", "logo-docker", "logo-dribbble", "logo-dropbox", "logo-edge", "logo-electron", "logo-euro", "logo-facebook", "logo-figma", "logo-firebase", "logo-firefox", "logo-flickr", "logo-foursquare", "logo-github", "logo-gitlab", "logo-google", "logo-google-playstore", "logo-hackernews", "logo-html5", "logo-instagram", "logo-ionic", "logo-ionitron", "logo-javascript", "logo-laravel", "logo-linkedin", "logo-markdown", "logo-mastodon", "logo-medium", "logo-microsoft", "logo-no-smoking", "logo-nodejs", "logo-npm", "logo-octocat", "logo-paypal", "logo-pinterest", "logo-playstation", "logo-pwa", "logo-python", "logo-react", "logo-reddit", "logo-rss", "logo-sass", "logo-skype", "logo-slack", "logo-snapchat", "logo-soundcloud", "logo-stackoverflow", "logo-steam", "logo-stencil", "logo-tableau", "logo-tiktok", "logo-tumblr", "logo-tux", "logo-twitch", "logo-twitter", "logo-usd", "logo-venmo", "logo-vercel", "logo-vimeo", "logo-vk", "logo-vue", "logo-web-component", "logo-wechat", "logo-whatsapp", "logo-windows", "logo-wordpress", "logo-xbox", "logo-xing", "logo-yahoo", "logo-yen"];
  textAligns = [{ "value": "center", "label": "Centrado" }, { "value": "justify", "label": "Justificado" }, { "value": "right", "label": "Derecha" }, { "value": "left", "label": "Izquierda" }];
  lineTypes = [{ "value": "dashed", "label": "Cortada" }, { "value": "solid", "label": "Sólida" }, { "value": "dotted", "label": "Punteada" }, { "value": "double", "label": "Doble" }, { "value": "groove", "label": "Sombreada" }, { "value": "hidden", "label": "Oculta" },]
  internalUrlList: any;
  typeCarouselList = [{ 'label': 'Horizontal', 'value': 'horizontal' }, { 'label': 'Horizontal 1', 'value': 'horizontal-1' }, { 'label': 'Horizontal 2', 'value': 'horizontal-2' }];
  carouselOptionList = ['slidesPerView', 'rotate', 'stretch', 'depth', 'modifier'];
  toolBarSize = 0;

  constructor(
    private alertCtrl: AlertController,
    private fairsService: FairsService,
    private pavilionsService: PavilionsService,
    private agendasService: AgendasService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private loading: LoadingService,
    private animationCtrl: AnimationController,
    private adminFairsService: AdminFairsService,
    private adminPavilionsService: AdminPavilionsService,
    private adminStandsService: AdminStandsService,
    private adminProductsService: AdminProductsService,
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
    private productsService: ProductsService,
    private popoverCtrl: PopoverController,
    private actionSheetController: ActionSheetController,
    private speakersService: SpeakersService,
    private datepipe: DatePipe,
    private categoryService: CategoryService,) {

    this.url = document.baseURI;
    this.listenForFullScreenEvents();
    this.initializeListeners();
    this.initializePanel();
    window.dispatchEvent(new CustomEvent('map:fullscreenIn'));
    this.changeEditSave(false);

  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    //if(window.location.href.indexOf('map') < 0) {
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    //}
  }

  ngAfterViewInit() {
    this.initializeScreen();

    //window.dispatchEvent(new CustomEvent( 'map:fullscreenIn'));
  }

  ngDoCheck() {
    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
    main.style.top = top + 'px';
    const div = document.querySelector<HTMLElement>('.div-container');
    div.style.height = (window.innerHeight - top) + 'px';
  }

  initializeScreen() {
    this.bannerSelect = null;
    this.loading.present({ message: 'Cargando...' });
    const url = window.location.href;
    this.template = url.indexOf('super-admin/map-editor/fair') >= 0 ? 'fair' :
      url.indexOf('super-admin/map-editor/pavilion') >= 0 ? 'pavilion' :
        url.indexOf('super-admin/map-editor/stand') >= 0 ? 'stand' :
          url.indexOf('super-admin/map-editor/product') >= 0 ? 'product' :
            '';

    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    const productId = this.route.snapshot.paramMap.get('productId');
    this.sceneId = this.route.snapshot.paramMap.get('sceneId');

    const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    main.style.top = top + 'px';
    const btnSave = document.querySelector<HTMLElement>('.panel-scene-save');
    const panelPosX = (main.offsetWidth - btnSave.offsetWidth - 600) + 'px';
    this.panelPos = { x: panelPosX + 'px', y: '0px' };

    this.fairsService.getCurrentFair().then((fair) => {

      this.fair = fair;

      this.initSpeakerTypeList();

      if (this.template === 'fair') {

        this.resources = fair.resources;
        this.scene = this.sceneId ? fair.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
        this.initializeScene();
      }
      else if (this.template === 'pavilion') {

        this.fair.pavilions.forEach((pavilion) => {
          if (pavilion.id == pavilionId) {
            this.pavilion = pavilion;
            this.resources = pavilion.resources;
            this.scene = this.sceneId ? this.pavilion.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
            this.initializeScene();
          }
        });
      }
      else if (this.template === 'stand') {

        this.fair.pavilions.forEach((pavilion) => {
          if (pavilion.id == pavilionId) {
            this.pavilion = pavilion;
            pavilion.stands.forEach((standEl) => {
              if (standEl.id == standId) {
                this.stand = standEl;
                this.resources = this.stand.resources;
                this.scene = this.sceneId ? this.stand.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
                this.initializeScene();
              }
            });
          }
        });
      }



    }, error => {
      this.loading.dismiss();
      this.errors = `Consultando las categorias de conferencistas ${error}`;
    });

  }


  initializeScene() {

    if (!this.scene) {
      this.loading.dismiss();
      this.errors = `Algo malo ha ocurrido`;
      return;
    }

    if (this.scene.videoUrl) {
      this.scene.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.scene.videoUrl);
    }

    this.scene.menuTabs = this.scene.menuTabs || { 'showMenuParent': true };
    this.resources.menuTabs = this.resources.menuTabs || {};

    this.scene.banners = this.scene.banners || [];

    this.onChangeBackgroundStyle();
    this.initializeInternalUrl();
    this.initializeGroupOfLinks();


    this.scene.banners.forEach((banner) => {
      if (banner.video) {
        banner.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(banner.video.url);
      }
      if (banner.productCatalog) {
        this.initializeProductCatalogs(banner);
      }
      if (banner.agendaCatalog) {
        this.initializeAgendaCatalogs(banner);
      }
      if (banner.speakerCatalog) {
        this.initializeSpeakers(banner);
      }
    });

    setTimeout(() => {
      this.initializeHtmlTexts(this.scene.banners);
      this.initializeCarousels();
      this.loading.dismiss();
    }, 5);

    if (this.scene.menuTabs && this.scene.menuTabs.showMenuParent) {
      this.tabMenuObj = Object.assign({}, this.resources.menuTabs);
    }
    else {
      this.tabMenuObj = this.scene.menuTabs;
    }

    this.scene.container = this.scene.container || { 'w': window.innerWidth, 'h': window.innerHeight }
    this.onResize();
  }

  initializeHtmlTexts(banners) {
    banners.forEach((banner) => {
      banner.textHtml = this.sanitizer.bypassSecurityTrustHtml(banner.text);
    });
  }

  initializeCarousels() {
    if (this.carrousels && this.carrousels._results) {
      this.carrousels._results.forEach((elm) => {
        elm.initialize();
        elm.onResize();
      });
    }
  }

  onResizeCarousels() {
    if (this.carrousels && this.carrousels._results) {
      this.carrousels._results.forEach((elm) => {
        elm.onResize();
      });
    }
  }

  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent(this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));
  }

  onChangeOpacity() {
    const originYRange: any = document.querySelector<HTMLElement>('.origin-y-range');
    this.bannerSelect.opacity = originYRange.value / 100;
  }

  onChangeItemColor() {

    if (this.bannerSelect)
      if (this.bannerSelect.video) {
        this.bannerSelect.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(this.bannerSelect.video.url);
      }
      else if (this.bannerSelect.productCatalog) {
        this.resizeProductCatalogs(this.bannerSelect);
      }
      else if (this.bannerSelect.speakerCatalog) {
        this.initializeSpeakers(this.bannerSelect);
      }
  }

  onRouterLink(tab) {
    //this.fullScreen = false;
    //window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
  }

  @HostListener('window:resize')
  onResizeAdjustSize() {
    this.onResize();
    setTimeout(() => { this.onResize(); }, 100);
  }

  onResize() {

    if (!this.scene) return;

    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    const menu = document.querySelector<HTMLElement>('.menu-main-content');
    const offsetWidth = window.innerWidth - menu.offsetWidth;
    this.toolBarSize = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
    main.style.top = this.toolBarSize + 'px';

    let newWidth = offsetWidth;//main.offsetWidth;
    const offsetHeight = window.innerHeight - this.toolBarSize;

    let deltaW = this.scene.container.w / newWidth;
    let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
    let deltaH = this.scene.container.h / newHeight;

    if (newHeight < offsetHeight) {
      if (this.scene.render) {
        newHeight = offsetHeight;
        newWidth = newHeight * this.scene.container.w / this.scene.container.h;
        deltaW = this.scene.container.w / newWidth;
        deltaH = this.scene.container.h / newHeight;
      }
    }
    this.scene.container.w = newWidth;
    this.scene.container.h = newHeight;


    this.scene.banners.forEach((banner) => {

      //position always changes size

      if (this.scene.render) {
        if (banner.size) {
          if (banner.size.typeX == null || banner.size.typeX == 'px') {
            banner.size.x /= deltaW;
          }
          if (banner.size.typeY == null || banner.size.typeY == 'px') {
            banner.size.y /= deltaH;
          }
        }

        if (banner.position) { banner.position.x /= deltaW; banner.position.y /= deltaH; }
        if (banner.fontSize > 0) banner.fontSize /= deltaW;
        if (banner.border && banner.border.radius > 0) banner.border.radius /= deltaH;
        if (banner.productCatalog) {
          ['buttonWidth', 'buttonHeight', 'buttonFontSize', 'buttonFontWeight', 'buttonRight',
            'buttonBottom', 'titleFontSize', 'titleFontWeight', 'titleLeft', 'titleTop', 'descTop',
            'descLeft', 'descWidth', 'descFontSize', 'lineHeight', 'priceTop', 'priceLeft', 'priceFontSize',
            'imageTop', 'imageLeft', 'imagesWidth', 'imagesHeight', 'imagesPriceWidth'].forEach((attr) => {
              if (banner.productCatalog[attr] > 0) banner.productCatalog[attr] /= deltaW;
            });
        }
        if (banner.speakerCatalog) {
          ['descFontSize', 'descFontWeight', 'descHeigth', 'descLeft', 'descTop', 'descWidth', 'titleTop',
            'imagesHeight', 'imagesLeft', 'imagesPriceWidth', 'imagesTop', 'imagesWidth', 'imagestitleWidth',
            'lineHeight', 'lineHeightMili', 'lineHeightUnit', 'logoHeight', 'logoLeft', 'logoTop', 'logoWidth',
            'nameFontSize', 'nameFontWeight', 'nameHeight', 'nameLeft', 'nameTop', 'nameWidth', 'priceLeft', 'priceTop',
            'professionFontSize', 'professionLeft', 'professionTop', 'titleFontSize', 'titleLeft'].forEach((attr) => {
              if (banner.speakerCatalog[attr] > 0) banner.speakerCatalog[attr] /= deltaW;
            });
        }
      }

      if (banner.productCatalog) this.resizeProductCatalogs(banner);
      if (banner.speakerCatalog) this.resizeSpeakers(banner);
    });

    //Menu tab resize/render
    this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);

    //product catalog and carrete of images resize/render 
    this.onResizeCarousels();
  }

  initializeCatalogs(banner) {
    if (banner.__productCatalogList || banner.speakerCatalog || banner.type === 'Título') {
      for (var i = 10; i > 0; i--) {

        if ((i * banner.size.x <= this.scene.container.w) || ((i - 0.5) * banner.size.x <= this.scene.container.w)) {
          banner.__factor = i - 1;
          const main = document.querySelector<HTMLElement>('ion-router-outlet');
          //const left = main.offsetWidth - ( ( ( banner.__factor ) * 1.03 ) * banner.size.x );
          //banner.position.x = left / 2;
          break;
        }
      }
    }
  }

  onBannerSelect(bannerSelect) {
    this.bannerSelect = bannerSelect;
    this.showSpeakerCatalogActions = null;
    if (this.tabSelect == 'speakerCatalog' && !this.bannerSelect.speakerCatalog) {
      this.tabSelect = 'position';
    }

    this.bannerSelect.hoverEffects = this.bannerSelect.hoverEffects || '';
    this.hoverEffects.forEach((effect) => {
      effect.isChecked = this.bannerSelect.hoverEffects.includes(effect.name);
    });
    this.showPanelTool = 'settingsBanner';
    this.bannerSelect.lineHeight = this.bannerSelect.lineHeight || '1.0';
    this.bannerSelect.lineHeightUnit = Number.parseInt(this.bannerSelect.lineHeight);
    this.bannerSelect.lineHeightMili = this.bannerSelect.lineHeight.split('.')[1];
    this.isHover = bannerSelect.id;
  }

  onChangeItem() {
    this.changeEditSave(true);
    this.historyList = this.historyList.filter((scene, indx) => {
      return indx <= this.historySel;
    });
    this.historyList.push(clone(this.scene));
    this.historySel++;
  }

  onChangeSizeItem() {

  }

  initializePanel() {
    const inputs = Array.from(document.querySelectorAll('.input-form'));
    inputs.forEach((input) => {
      input.addEventListener('ionInput', this.onChangeItem);
    });
  }

  onSave() {
    this.loading.present({ message: 'Cargando...' });
    if (this.sceneId) {
      this.resources.scenes[this.sceneId] = this.scene;
    }
    else {
      this.resources.scenes = this.resources.scenes || [];
      this.resources.scenes.push(this.scene);
    }

    if (this.editMenuTabSave && this.scene.menuTabs.showMenuParent) {
      this.resources.menuTabs = this.tabMenuObj;
    }

    if (this.template === 'fair') {
      this.fair.resources = this.resources;
      this.adminFairsService.updateFair(this.fair)
        .then((response) => {
          if (!this.sceneId) {
            this.fair = processData(response.data_fair);
            this.resources = processData(this.fair.resources);
            this.sceneId = this.resources.scenes.length - 1;
            this.fair.location = JSON.parse(this.fair.location);
            this.fair.location.push({ 'type': 'sceneFair', 'iScene': this.sceneId, 'menuPosition': this.fair.location.length + 1 });
            const fair = Object.assign({}, { 'id': this.fair.id, 'location': JSON.stringify(this.fair.location) });
            this.adminFairsService.updateFair(fair)
              .then((response) => {
                this.redirectTo(`super-admin/map-editor/fair/${this.sceneId}`);
                this.reload();
              });
          }
          else {
            this.redirectTo(`super-admin/map-editor/fair/${this.sceneId}`);
            this.reload();
          }
        })
        .catch(error => {
          this.loading.dismiss();
          this.errors = `Consultando el servicio para actualizar feria ${error}`;
        });
    }
    else if (this.template === 'pavilion') {
      this.pavilion.resources = this.resources;
      this.adminPavilionsService.update(this.pavilion)
        .then((pavilion) => {

          if (!this.sceneId) {
            this.resources = processData(pavilion.resources);
            this.sceneId = this.resources.scenes.length - 1;
          }

          this.redirectTo(`super-admin/map-editor/pavilion/${this.pavilion.id}/${this.sceneId}`);
          this.reload();

        })
        .catch(error => {
          this.loading.dismiss();
          this.errors = `Consultando el servicio para actualizar pabellón ${error}`;
        });
    }
    else if (this.template === 'stand') {
      this.stand.resources = this.resources;
      this.adminStandsService.update(this.stand)
        .then((stand) => {

          if (!this.sceneId) {
            this.resources = processData(stand.resources);
            this.sceneId = this.resources.scenes.length - 1;
          }

          this.redirectTo(`super-admin/map-editor/stand/${this.pavilion.id}/${this.stand.id}/${this.sceneId}`);
          this.reload();
        })
        .catch(error => {
          this.loading.dismiss();
          this.errors = `Consultando el servicio para actualizar local comercial ${error}`;
        });
    }
    else if (this.template === 'product') {
      this.product.resources = this.resources;
      this.adminProductsService.update(Object.assign({ 'fair_id': this.fair.id, 'pavilion_id': this.pavilion.id, 'stand_id': this.stand.id }, this.product))
        .then((product) => {
          this.loading.dismiss();
          if (!this.sceneId) {
            this.resources = processData(product.resources);
            this.sceneId = this.resources.scenes.length - 1;
          }
          this.redirectTo(`super-admin/map-editor/product/${this.pavilion.id}/${this.stand.id}/${this.product.id}/${this.sceneId}' + this.pavilion.id + '/' + this.stand.id + '/' + this.product.id + '/' + this.sceneId`);
          this.reload();
        })
        .catch(error => {
          this.loading.dismiss();
          this.errors = `Consultando el servicio para actualizar producto ${error}`;
        });
    }
  }

  onSaveTabMenu() {
    this.resources.menuTabs = this.resources.menuTabs || { 'actions': [] };
    this.resources.menuTabs.id = this.resources.menuTabs.id || this._getId();
    this.resources.menuTabs.actions = this.resources.menuTabs.actions || [];
    if (this.scene.menuTabs.showMenuParent) {
      if (this.tabMenuInstance.isNew) {
        this.tabMenuInstance.isNew = false;
        this.tabMenuInstance.tabId = this.resources.menuTabs.actions.length + 1;
        this.resources.menuTabs.actions.push(this.tabMenuInstance);
      }
      this.tabMenuObj = this.resources.menuTabs;
    }
    else {
      if (this.tabMenuInstance.isNew) {
        this.tabMenuInstance.isNew = false;
        this.tabMenuInstance.tabId = this.scene.menuTabs.actions.length + 1;
        this.scene.menuTabs.actions.push(this.tabMenuInstance);
        this.tabMenuObj = this.scene.menuTabs;
      }
    }
    this.onChangeItem();
    this.onChangeMenuTabs();
  }

  addArrowLineCurve() {
    const id = new Date().valueOf();
    const banner = { "style": "container-arrow--curve", "line": { "weight": "4", "type": "dashed" }, "fontColor": "#000000", "backgroundColor": "#ffff00", "position": { "y": 156, "x": 195 }, "rotation": { "x": 0, "y": 0, "z": 0 }, "size": { "x": 114, "y": 105 }, "id": id };
    this.scene.banners.push(banner);
    this.onChangeItem();
  }

  addArrowLineRect() {
    const id = new Date().valueOf();
    const banner = { "style": "container-arrow--rect", "line": { "weight": "4", "type": "dashed" }, "fontColor": "#000000", "backgroundColor": "#ffff00", "position": { "y": 156, "x": 195 }, "rotation": { "x": 0, "y": 0, "z": 0 }, "size": { "x": 114, "y": 105 }, "id": id };
    this.scene.banners.push(banner);
    this.onChangeItem();
  }

  addArrowLineLine() {
    const id = new Date().valueOf();
    const banner = { "style": "container-arrow--line", "line": { "weight": "4", "type": "dashed" }, "fontColor": "#000000", "backgroundColor": "#ffff00", "position": { "y": 156, "x": 195 }, "rotation": { "x": 0, "y": 0, "z": 0 }, "size": { "x": 114, "y": 105 }, "id": id };
    this.scene.banners.push(banner);
    this.onChangeItem();
  }


  addBanner(type) {
    const id = new Date().valueOf();
    const primaryColor = "#007bff";
    let banner: any;
    const _defaultBanner = {
      id: id, type: type, rotation: { "x": 0, "y": 0, "z": 0 }, "position": this.getNewPosition({ "x": 156, "y": 195 }), border: { "style": "none" },
      'fontWeight': 100, 'fontFamily': 'YoutubeSansMedium', 'fontSize': 12, "lineHeight": "1.0", "lineHeightUnit": 1, "lineHeightMili": "0", "shadowActivate": false, "shadowRight": 4, "shadowDown": 4, "shadowDisperse": 7, "shadowExpand": 2, "shadowColor": "#ababab"
    };
    switch (type) {
      case 'Text':
        banner = { "textAlign": "left", "fontColor": "#000000", "text": "Texto aquí", "size": { "x": 100, "y": 20 } };
        break;
      case 'Image':
        banner = { "size": { "x": 114, "y": 105 }, "image_url": "https://dummyimage.com/114x105/EFEFEF/000.png" };
        break;
      case 'Carrete':
        const allImages = [
          { "size": { "x": 50, "y": 88 }, "title": "We are covered", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/covered.jpg" },
          { "size": { "x": 50, "y": 88 }, "title": "Generation Gap", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/generation.jpg" },
          { "size": { "x": 50, "y": 88 }, "title": "Potter Me", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/potter.jpg" },
          { "size": { "x": 50, "y": 88 }, "title": "Pre-School Kids", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/preschool.jpg" },
          { "size": { "x": 50, "y": 88 }, "title": "Young Peter Cech", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/soccer.jpg" }
        ];
        banner = { "size": { "x": 1156, "y": 236 }, "carousel": { "options": { slidesPerView: 3, rotate: 0, stretch: 50, depth: 100, slideShadows: false, modifier: 1 }, "style": "horizontal", "images": allImages } };
        break;
      case 'Video':
        banner = { "size": { "x": 114, "y": 105 }, "video": { "url": "https://player.vimeo.com/video/286898202" } };
        banner.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(banner.video.url);
        break;
      case 'Título':
        banner = {
          "textAlign": "center", "fontColor": "#00B8FF", "text": "Título de la Escena aquí", "size": { "x": 571, "y": 70 }, "fontSize": 59,
          "class": "w-100vw", "position": this.getNewPosition({ "x": 0, "y": 95 })
        };
        break;
      case 'Sub-Título':
        banner = { "size": { "x": 114, "y": 105 }, "fontColor": "#00B8FF" };
        break;
      case 'Párrafo':
        banner = {
          "size": { "x": 200, "y": 149 }, "textAlign": "left", "fontColor": "#000000", "text": "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        };
        break;
      case 'SpeakerCatalog':
        banner = {
          "size": { "x": 428, "y": 237 },
          "position": this.getNewPosition({ "x": 64, "y": 29 }),
          "speakerCatalog": {
            "nameFontSize": 24, "nameFontColor": "#ffffff", "nameTop": 26, "nameLeft": 225, "nameFontFamily": "YoutubeSansMedium", "nameFontWeight": "100",
            "descHeigth": 69,
            "descTop": 139, "descLeft": 198, "descWidth": 208, "descFontSize": 14, "descTextAlign": "justify", "lineHeightMili": 0, "lineHeightUnit": 1, "lineHeight": 1, "descFontFamily": "YoutubeSansLight", "descFontWeight": 100, "titleFontColor": "#000", "titleFontFamily": "YoutubeSansMedium", "titleFontSize": 19, "titleFontWeight": "bold", "titleLeft": 0, "titleTop": 113, "imagesTop": 0, "imagesLeft": 0, "imagesWidth": 187, "imagesHeight": 224, "imagesPriceWidth": 16, "imagestitleWidth": null, "priceTop": 38, "priceLeft": 27, "priceFontColor": "#ff1a1a", "nameWidth": 177, "nameHeight": 0, "logoLeft": 142, "logoTop": 26, "logoWidth": 74, "logoHeight": 69, "professionFontColor": "#ffffff", "professionTop": 97, "professionLeft": 199, "descFontColor": "", "professionFontSize": 15
          }, "backgroundColor": "#109be0",
          "class": "rounded-withradius grayscale cursor-pointer overflow-hidden", "fontColor": "#ffffff"
        };
        banner.border = { "radius": 19, "style": "solid", "color": "rgba(0,0,0,.125)" };
        break;
      case 'ProductCatalog':
        banner = {
          "size": { "x": 428, "y": 237 },
          "position": this.getNewPosition({ "x": 64, "y": 29 }),
          "productCatalog": {
            'buttonWidth': 145,
            'buttonHeight': 28,
            'buttonBackgroundColor': primaryColor,
            'buttonFontColor': '#fff',
            'buttonFontFamily': 'YoutubeSansMedium',
            'buttonFontSize': 12,
            'buttonFontWeight': 'bold',
            'buttonLabel': 'Ver Oferta',
            'buttonRight': 10,
            'buttonBottom': 10,
            'titleFontSize': 23,
            'titleFontColor': '#004782',
            'titleTop': 10,
            'titleLeft': 69,
            'titleFontFamily': 'YoutubeSansMedium',
            'titleFontWeight': 70,
            'descTop': 54,
            'descLeft': 170,
            'descWidth': 238,
            'descFontSize': 12,
            'descTextAlign': 'justify',
            'lineHeightMili': 0,
            'lineHeightUnit': 1,
            'lineHeight': 1.0,
            'descFontFamily': 'YoutubeSansLight',
            'descFontWeight': 100,
            'priceFontColor': '#000',
            'priceFontFamily': 'YoutubeSansMedium',
            'priceFontSize': 19,
            'priceFontWeight': 'bold',
            'priceLeft': 0,
            'priceTop': 113,
            'imagesTop': 18,
            'imagesLeft': 6,
            'imagesWidth': 146,
            'imagesHeight': 146,
            'imagesPriceWidth': 16,
          }, 'backgroundColor': '#f5f6ff'
        };
        banner.border = { "radius": 19, "style": "solid", "color": "rgba(0,0,0,.125)" };

        break;
      case 'ContactCatalog':
        banner = { "groupMode": true, "size": { "x": 367, "y": 408 }, "contact": { "name": "" }, "backgroundColor": "#ffffff", "fontColor": "#000000", "fontSize": "13", "shadowActivate": true, "shadowRight": -8, "shadowDown": 4, "shadowDisperse": 21, "shadowExpand": -16 };
        break;
      case 'ProductName':
        banner = { "size": { "x": 300, "y": 33 }, "position": this.getNewPosition({ "x": 532, "y": 41 }), "fontColor": "#F5F6FF", "fontSize": "25" };
        break;
      case 'ProductDescription':
        banner = { "size": { "x": 530, "y": 205 }, "position": this.getNewPosition({ "x": 359, "y": 115 }), "textAlign": "justify", "fontColor": "#000", "fontSize": "16" };
        break;
      case 'ProductCarousel':
        banner = { "size": { "x": 304, "y": 291 }, "position": this.getNewPosition({ "x": 117, "y": 141 }) };
        break;
      case 'Banner':
        banner = {
          "fontColor": "#000000", "backgroundColor": "#ffff00", "size": { "x": 114, "typeX": "px", "y": 105, "typeY": "px" },
          "border": { "style": "solid", "color": "#000", "radius": 20, "width": 1 }
        };
        break;
      case 'AgendaCatalog':
        banner = { "groupMode": true, "size": { "x": 367, "y": 408 }, "agendaCatalog": { "category": "" }, "class": "w-100vw" };
        break;
      case 'FormCatalog':
        banner = { "groupMode": true, "position": this.getNewPosition({ "x": 117, "y": 74 }), "size": { "x": 170, "y": 50 }, "formCatalog": { "category": "" }, "image_url": "https://files.pucp.education/departamento/teologia/2021/09/25213139/Boton-inscripcion-300x90.png", "class": "cursor-pointer" };
        break;
    }

    this.scene.banners.push(Object.assign(_defaultBanner, banner));
    //open settingsBanner panel with last element
    this.bannerSelect = this.scene.banners[this.scene.banners.length - 1];
    if (this.bannerSelect.productCatalog) this.presentNewProductListCatalog(this.bannerSelect);
    if (this.bannerSelect.agendaCatalog) this.presentNewAgendaListCatalog(this.bannerSelect);
    if (this.bannerSelect.formCatalog) this.presentNewFormListCatalog(this.bannerSelect);
    if (this.bannerSelect.speakerCatalog) this.presentNewSpeakerListCatalog(this.bannerSelect, 'new');
    if (this.bannerSelect.speakerCatalog) this.initializeSpeakers(this.bannerSelect);
    this.onChangeItem();
    this.showPanelTool = 'settingsBanner';
  }

  async presentNewProductListCatalog(banner) {

    const modal = await this.modalCtrl.create({
      component: ProductListComponent,
      swipeToClose: true,
      backdropDismiss: false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'template': this.template, 'fair': this.fair, 'pavilion': this.pavilion, 'stand': this.stand }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      banner.productCatalog.list = data.categorySelected;
      banner.__productCatalogList = {};
      banner.__productCatalogList.products = data.products;
    }
    else {
      this.onDeleteBanner(banner);
    }
  }

  async presentNewAgendaListCatalog(banner) {

    const modal = await this.modalCtrl.create({
      component: AgendaListComponent,
      swipeToClose: false,
      backdropDismiss: false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'template': this.template, 'fair': this.fair }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      banner.agendaCatalog.category = data.categorySelected;
      banner.__agendaCatalogList = {};
      banner.__agendaCatalogList.agendas = data.agendaList;
      banner.__agendaCatalogList.groups = [];
      this.transformSchedule(banner);
      this.initializeAgendaCatalogs(banner);
    }
    else {
      this.onDeleteBanner(banner);
    }
  }

  async presentNewFormListCatalog(banner) {

    const modal = await this.modalCtrl.create({
      component: AgendaListComponent,
      swipeToClose: false,
      backdropDismiss: false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'template': this.template, 'fair': this.fair }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      banner.formCatalog.category = data.categorySelected;
      banner.__formCatalog = {};
      banner.__formCatalog.agendas = data.agendaList;
      banner.__formCatalog.groups = [];
      this.transformSchedule(banner);
    }
    else {
      this.onDeleteBanner(banner);
    }
  }

  async presentNewSpeakerListCatalog(banner, action) {

    const modal = await this.modalCtrl.create({
      component: SpeakerListComponent,
      swipeToClose: false,
      backdropDismiss: false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'template': this.template, 'allElementList': this.speakerList, 'catalogList': this.speakerTypeList }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      banner.speakerCatalog.speakerType = data.categorySelected;
      banner.__speakerCatalogList = data.elementList;
      banner.__factor = 3;
      if (action == 'new') {
        this.filterSpeakerList(banner);
        this.onChangeSpeakerStyle(banner);
      }
      this.resizeSpeakers(banner);
    }
    else {
      if (action == 'new') {
        this.onDeleteBanner(banner);
      }
    }
  }

  getNewPosition(pos) {
    this.scene.banners.forEach((banner) => {
      if (banner.position.x == pos.x && banner.position.y == pos.y) {
        pos = this.getNewPosition({ "x": pos.x + 10, "y": pos.y + 10 });
      }
    });
    return pos;
  }


  dragStart(event) {

  }

  dragPanelSceneSelectEnd(event) {
    const panel = document.querySelector<HTMLElement>('.panel-scene-select');
    this.panelPos.y = (panel.offsetTop + event.y) + 'px';
    this.panelPos.x = (panel.offsetLeft + event.x) + 'px';
  }

  dragBannerEnd($event, banner) {
    banner.position.y += $event.y;
    banner.position.x += $event.x;
    if (banner.banners) {
      banner.banners.forEach((bannerch) => {
        bannerch.position.y += $event.y;
        bannerch.position.x += $event.x;
      });
    }
    this.onChangeItem();
  }

  onDeleteBanner(bannerSelect) {
    this.scene.banners = this.scene.banners.filter((banner) => {
      return bannerSelect != banner;
    });
    this.bannerSelect = null;
    this.showPanelTool = false;
    this.onChangeItem();
  }

  async onDeleteBannerList(itemList) {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borra agenda?',
      subHeader: 'Confirma para borrar los elementos seleccionados',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {

            const newList = [];
            this.scene.banners.forEach((banner) => {
              if (!banner.isChecked) {
                newList.push(banner);
              }
            });

            this.scene.banners = newList;
            this.onChangeItem();
            this.copyMultiFromList = [];
          }
        }
      ]
    });
    await alert.present();

  }

  onCopyBanner(itemList) {
    let id = new Date().valueOf();
    this.bannerCopy = [];
    itemList.forEach((banner) => {
      const newBanner = clone(banner);
      newBanner.id = id;
      newBanner.position = this.getNewPosition(banner.position);
      this.bannerCopy.push(newBanner);
      id++;
    });

    let aux = document.createElement("input");
    aux.setAttribute("value", JSON.stringify(itemList));
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);

    const msg = itemList.length > 1 ? `${itemList.length} Objetos copiados en el portapapeles` : ` 1 Objeto copiado en el portapapeles`;
    this.presentToast(msg);
  }

  onPasteBannerBtn() {
    let id = new Date().valueOf();
    this.bannerCopy.forEach((banner) => {
      const newBanner = Object.assign({}, banner);
      newBanner.id = id;
      newBanner.position = this.getNewPosition(banner.position);
      this.scene.banners.push(newBanner);
      id++;
      this.onChangeItem();
    });

    setTimeout(() => {
      this.initializeHtmlTexts(this.scene.banners);
    }, 5);

    this.bannerCopy = [];
  }

  listenForFullScreenEvents() {

    window.addEventListener('map:fullscreenOff', (e: any) => {
      setTimeout(() => {
        this.editModeBackdrop = false;
        this.fullScreen = false;
        this.onResize();
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e: any) => {
      setTimeout(() => {
        this.fullScreen = true;
        this.onResize();
      }, 300);
    });
  }

  initializeListeners() {
    window.addEventListener('window:resize-menu', () => {
      setTimeout(() => { this.onResize(); }, 100);
    });
  }

  async startAnimation(obj) {

    if (!obj.hoverEffects) return;

    if (obj.hoverEffects.includes('GirarDerecha')) {
      const squareA = this.animationCtrl.create()
        .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))

        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'rotate(0)' },
          { offset: 0.5, transform: 'rotate(45deg)' },
          { offset: 1, transform: 'rotate(0) ' }
        ]);
      await squareA.play();
    }
    if (obj.hoverEffects.includes('GirarIzquierda')) {
      const squareA = this.animationCtrl.create()
        .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))

        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'rotate(0)' },
          { offset: 0.5, transform: 'rotate(-45deg)' },
          { offset: 1, transform: 'rotate(0) ' }
        ]);
      await squareA.play();
    }
  }

  onChangeEffect(effectChange) {

    this.bannerSelect.hoverEffects = '';
    this.hoverEffects.forEach((effect) => {
      if ((effect.name !== effectChange.name && effect.isChecked) || (effect.name === effectChange.name && !effectChange.isChecked)) {
        this.bannerSelect.hoverEffects += effect.name + ";";
      }
    });
    this.onChangeItem();
  }

  async onDeleteScene(sceneId) {
    const alert = await this.alertCtrl.create({
      message: 'Confirma para eliminar la escena',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            this.loading.present({ message: 'Cargando...' });
            this.resources.scenes = this.resources.scenes.filter((scene, key) => {
              return key != sceneId;
            });

            if (this.template === 'fair') {
              this.fair.resources = this.resources;
              this.adminFairsService.updateFair(this.fair)
                .then((response) => {
                  this.router.navigateByUrl(`/super-admin/fair`);
                  this.reload();
                })
                .catch(error => {
                  this.loading.dismiss();
                  this.errors = `Consultando el servicio para actualizar la feria: ${error}`;
                });
            }
            else if (this.template === 'pavilion') {
              this.pavilion.resources = this.resources;
              this.adminPavilionsService.update(this.pavilion)
                .then((response) => {
                  this.router.navigateByUrl(`/super-admin/pavilion/${this.pavilion.id}`);
                  this.reload();
                })
                .catch(error => {
                  this.loading.dismiss();
                  this.errors = `Consultando el servicio para actualizar el pabellón: ${error}`;
                });
            }
            else if (this.template === 'stand') {
              this.stand.resources = this.resources;
              this.adminStandsService.update(this.stand)
                .then((response) => {
                  this.router.navigateByUrl(`/super-admin/stand/${this.pavilion.id}/${this.stand.id}`);
                  this.reload();
                })
                .catch(error => {
                  this.loading.dismiss();
                  this.errors = `Consultando el servicio para actualizar el pabellón: ${error}`;
                });
            }

          }
        }
      ]
    });
    await alert.present();
  }

  async onDeleteTabMenu(tabMenuInstance) {
    const alert = await this.alertCtrl.create({
      message: 'Confirma para eliminar acción de menú',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            this.tabMenuObj.actions = this.tabMenuObj.actions.filter((tab, key) => {
              return key != tabMenuInstance.tabId;
            });
            this.onChangeItem();
          }
        }
      ]
    });
    await alert.present();
  }

  initializeInternalUrl() {
    this.internalUrlList = { 'fair': [], 'pavilions': [], 'stands': [] };
    let scene, pavilion, stand;
    for (let i = 0; i < this.fair.resources.scenes.length; i++) {
      scene = this.fair.resources.scenes[i];
      this.internalUrlList.fair.push({ 'label': 'Escena - ' + (i + 1) + ': ' + scene.title, 'value': `/map/fair/${i}` });
    }
    for (let i = 0; i < this.fair.pavilions.length; i++) {
      pavilion = this.fair.pavilions[i];
      for (let j = 0; j < pavilion.resources.scenes.length; j++) {
        scene = pavilion.resources.scenes[j];
        this.internalUrlList.pavilions.push({ 'label': 'Pabellón ' + pavilion.name + '. Escena - ' + (j + 1), 'value': `/map/pavilion/${pavilion.id}/${j}` });
      }
      for (let j = 0; j < pavilion.stands.length; j++) {
        stand = pavilion.stands[j];
        for (let k = 0; k < stand.resources.scenes.length; k++) {
          scene = stand.resources.scenes[k];
          this.internalUrlList.stands.push({ 'label': 'Local ' + stand.merchant.name + '. Escena - ' + (k + 1), 'value': `/map/stand/${pavilion.id}/${stand.id}/${k}` });
        }
      }
    }
  }

  defaultEscene(resources) {
    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    resources.scenes = resources.scenes || [];

    return {
      'banners': [],
      'container': { 'w': 1092, 'h': 768 },
      'show': true,
      'menuIcon': 'map-outline',
      'title': 'Escena #' + (resources.scenes.length + 1),
      'menuTabs': { 'showMenuParent': true, 'position': 'none' }
    }
  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.value == e2.value : e1 == e2;
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

  fixedBannerPanelValidator({ x, y }: any): boolean {
    const icon = document.querySelector<HTMLElement>('#fixed-banner-icon');
    return icon.getAttribute('ng-reflect-name') === 'move-outline';
  }

  onSelectPanel(tabname) {
    if (this.showPanelTool == tabname) {
      this.showPanelTool = null;
    }
    else {
      this.showPanelTool = tabname;
    }
  }

  onChangeColorTabMenu() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.tabs-menu-scene.bottom::before, .tabs-menu-scene.bottom::after {box-shadow: 0 -17px 0 0 ' + this.tabMenuObj.backgroundColor + ' !important}';
    style.innerHTML += '.tabs-menu-scene .head { background-color: ' + this.tabMenuObj.backgroundColorLogo + '} ';
    style.innerHTML += '.tabs-menu-scene.bottom .head::before, .tabs-menu-scene.bottom .head::after { box-shadow: 0 -17px 0 0 ' + this.tabMenuObj.backgroundColorLogo + ' !important;}';

    document.getElementsByTagName('head')[0].appendChild(style);
    this.onChangeMenuTabs();
    this.onChangeItem();
  }

  initializeGroupOfLinks() {

    this.groupOfLinks = [];

    let group, scene, pavilion, stand;
    group = { 'label': 'Escenas de Feria', 'links': [] };
    for (let i = 0; i < this.fair.resources.scenes.length; i++) {
      scene = this.fair.resources.scenes[i];
      group.links.push({ 'label': 'Escena - ' + scene.title, 'value': `/map/fair/${i}` });
    }
    this.groupOfLinks.push(group);

    for (let i = 0; i < this.fair.pavilions.length; i++) {
      pavilion = this.fair.pavilions[i];
      group = { 'label': 'Escenas de Pabellón - ' + pavilion.name, 'links': [] };
      for (let j = 0; j < pavilion.resources.scenes.length; j++) {
        scene = pavilion.resources.scenes[j];
        group.links.push({ 'label': 'Escena - ' + scene.title, 'value': `/map/pavilion1/${pavilion.id}/${j}` });
      }
      this.groupOfLinks.push(group);

      for (let j = 0; j < pavilion.stands.length; j++) {
        stand = pavilion.stands[j];
        group = { 'label': 'Escenas de Local - ' + stand.merchant.name, 'links': [] };
        for (let j = 0; j < stand.resources.scenes.length; j++) {
          scene = stand.resources.scenes[j];
          group.links.push({ 'label': 'Escena - ' + scene.title, 'value': `/map/stand1/${pavilion.id}/${stand.id}/${j}` });
        }
        this.groupOfLinks.push(group);
      }
    }

  }

  doReorderBanners(ev: any) {
    // Before complete is called with the items they will remain in the
    // order before the drag

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items


    let from = this.scene.banners[ev.detail.from];
    let to = this.scene.banners[ev.detail.to];

    let list = [];
    this.scene.banners.forEach((banner, key) => {

      if (ev.detail.from < ev.detail.to) { //down mode
        if (key == ev.detail.to) {
          list.push(banner);
          list.push(from);
        }
        else if (key < ev.detail.from || key > ev.detail.from && key < ev.detail.to || key > ev.detail.to) {
          list.push(banner);
        }
      }
      else { //up mode
        if (key == ev.detail.to) {
          list.push(from);
          list.push(banner);
        }
        else if (key < ev.detail.from || key > ev.detail.from && key < ev.detail.to || key > ev.detail.to) {
          list.push(banner);
        }
      }
    });
    this.scene.banners = ev.detail.complete(this.scene.banners);
    this.onChangeItem();
  }

  doReorderCarousel(ev: any) {
    this.bannerSelect.carousel.images = ev.detail.complete(this.bannerSelect.carousel.images);
    this.onChangeItem();
  }

  toogleTabMenu() {
    this.scene.menuTabs.showMenuParent = !this.scene.menuTabs.showMenuParent;
    this.tabMenuObj = this.scene.menuTabs.showMenuParent ? this.resources.menuTabs : this.scene.menuTabs;
    this.onChangeItem();
  }

  onChangeMenuTabs() {
    this.onChangeItem();
    this.editMenuTabSave = true;
    this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);
  }

  onChangeSpeakerStyle(banner) {
    let style = document.createElement('style');
    const id = 'card-style-id-' + banner.id;
    style.type = 'text/css';
    style.id = id;
    style.innerHTML = '.' + id + ':hover { color: ' + banner.fontColor + '; background-image: linear-gradient(' + banner.backgroundColor + ', ' + banner.backgroundColor + '), linear-gradient(to top right, #BEBEBE, #FEFEFE); }';

    style.innerHTML += '.' + id + ' .name { color: ' + banner.speakerCatalog.nameFontColor + '; } ';
    style.innerHTML += '.' + id + ' .desc { color: ' + banner.speakerCatalog.descFontColor + '; } ';
    style.innerHTML += '.' + id + ' .profession { color: ' + banner.speakerCatalog.professionFontColor + '; } ';

    if (document.querySelector('#' + id)) {
      document.getElementsByTagName('head')[0].removeChild(document.querySelector('#' + id));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  setModifyTab(tab, i) {
    this.tabMenuInstance = Object.assign(tab, { 'tabId': i, 'isNew': false });
  }

  onPasteFromClipboard() {
    try {
      let pasteText = <HTMLInputElement>document.getElementById("output-clipboard");
      const jsonText = pasteText.value;

      const itemList = JSON.parse(jsonText);
      pasteText.value = '';
      let id = new Date().valueOf();
      this.bannerCopy = [];
      if (itemList.length > 0) {
        itemList.forEach((banner) => {
          const newBanner = Object.assign({}, banner);
          newBanner.id = id;
          newBanner.position = this.getNewPosition(banner.position);
          this.bannerCopy.push(newBanner);
          id++;
          this.onChangeItem();
          this.showInputClipboard = false;
        });

        //Add element into scene
        this.onPasteBannerBtn();
        let msg = itemList.length > 1 ? `${itemList.length} objetos adicionados en la escena` : `1 objeto adicionado en la escena`;
        this.presentToast(msg);
      }
    } catch (e) {
      let msg = e.message ? e.message : e.error ? e.error : '';
      if (msg.length > 50) msg = msg.substr(0, 50);
      this.presentToast(`Error al copiar objeto: ${msg} `);
    }

  }

  async onAddImgCarousel() {

    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa la ruta de la imágen",
      inputs: [
        {
          name: 'url',
          value: 'https://dummyimage.com/225x105/EFEFEF/000.png',
          placeholder: 'Url'
        },
        {
          name: 'title',
          value: 'Título de imágen'
        },
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Guardar',
        role: 'destructive',
        handler: (data) => {
          this.onChangeItem();
          this.bannerSelect.carousel.images = this.bannerSelect.carousel.images || [];
          this.bannerSelect.carousel.images.push({ 'url': data.url, 'title': data.title });
        }
      }]
    });
    await actionAlert.present();

  }

  async presentProductListCarousel() {

    const modal = await this.modalCtrl.create({
      component: ProductListComponent,
      swipeToClose: true,
      //backdropDismiss:false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'template': this.template, 'fair': this.fair, 'pavilion': this.pavilion, 'stand': this.stand }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.bannerSelect.carousel.images = this.bannerSelect.carousel.images || []
      this.bannerSelect.carousel.images.push({ 'list': data });
    }
  }


  async onOpenChangeImg(image, list, index) {

    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa la ruta de la imágen",
      inputs: [
        {
          name: 'url',
          value: image.url,
          placeholder: 'Url'
        },
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Guardar',
        role: 'destructive',
        handler: (data) => {
          this.onChangeItem();
          image.url = data.url;
        }
      }]
    });
    await actionAlert.present();

  }


  async onDeleteCarretImg(image, list, type, index) {

    const actionAlert = await this.alertCtrl.create({
      message: "Confirma para eliminar la " + (image.url ? "imágen" : "lista de productos"),
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Eliminar',
        role: 'destructive',
        cssClass: 'danger',
        handler: (data) => {
          this.onChangeItem();
          list[type] = list[type].filter((img, key) => {
            return key != index;
          });

          this.initializeCarousels();
        }
      }]
    });
    await actionAlert.present();

  }

  onClickOpenHtmlInput(obj, idType) {
    if (obj[idType].isHtml) {
      this.onClickOpenHtml(obj, idType)
    }
  }

  onClickOpenHtml(obj, idType) {

    this.showHtmlEditor = true;
    this.showPanelTool = null;
    this.htmlEditor = { obj: obj, idType: idType };

    let text;
    if (typeof obj[idType] != 'undefined' && obj[idType]) {
      text = '<textarea id="editorhtml">' + obj[idType] + '</textarea>';
    }
    else {
      text = '<textarea id="editorhtml"></textarea>';
    }
    document.querySelector<HTMLElement>('#content-editorhtml').innerHTML = text;


    (window as any).tinymce.init({
      selector: 'textarea#editorhtml',
      height: 500,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen textcolor',
        'link image imagetools table spellchecker lists',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar:
        'undo redo | formatselect | ' +
        'bold italic backcolor forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    });
  }

  onCleanHtml() {
    this.showHtmlEditor = false;
    this.showPanelTool = 'settingsBanner';
    this.htmlEditor.obj[this.htmlEditor.idType] = '';
    this.htmlEditor.obj.isHtml = false;

  }

  onCloseHtml() {
    this.showHtmlEditor = false;
    this.showPanelTool = 'settingsBanner';
  }

  onAcceptHtml() {
    const iframe = <HTMLIFrameElement>document.querySelector('#editorhtml_ifr');
    const newText = (<HTMLElement>iframe.contentWindow.document.body).innerHTML;
    //this.htmlEditor.obj[this.htmlEditor.idType] = (<any>this.sanitizer.bypassSecurityTrustHtml(newText)).changingThisBreaksApplicationSecurity;
    this.htmlEditor.obj[this.htmlEditor.idType] = newText;
    this.showPanelTool = 'settingsBanner';
    this.showHtmlEditor = false;
    this.htmlEditor.obj.isHtml = true;
    this.initializeHtmlTexts([this.htmlEditor.obj]);
  }

  onToBackEditor(scene) {
    window.history.back();
  }

  onChangeCarousel() {
    this.onChangeItem();
    this.onResizeCarousels();
  }

  toogleSelection() {
    this.selectionElementList = this.selectionElementList ? false : true;
    this.scene.banners.forEach((banner) => {
      banner.isChecked = this.selectionElementList;
    });
    this.copyMultiFromList = [];
    this.scene.banners.forEach((banner) => {
      if (banner.isChecked) {
        this.copyMultiFromList.push(banner);
      }
    });
  }

  toogleOneSelection() {
    this.copyMultiFromList = [];
    this.scene.banners.forEach((banner) => {
      if (banner.isChecked) {
        this.copyMultiFromList.push(banner);
      }
    });
  }

  onMouseWheel(evt) {
    const div = document.querySelector<HTMLElement>('.div-container');
    const scrollLeft = div.scrollLeft + evt.deltaY;
    const scrollTop = div.scrollTop + evt.deltaY;
    div.scrollLeft = scrollLeft;
    div.scrollTop = scrollTop;
  }

  onChangeItemTextLineHeight(obj) {

    if (!obj.lineHeight) {
      obj.lineHeight = 1;
      obj.lineHeightUnit = 1;
    }
    const mili = Number.parseInt(obj.lineHeight);
    const unit = Number.parseFloat(obj.lineHeight) | 0;

    if (obj.lineHeightMili > 9) {
      obj.lineHeightMili = 0;
      obj.lineHeightUnit++;
    }
    else if (obj.lineHeightMili < 0) {
      obj.lineHeightMili = 9;
      obj.lineHeightUnit--;
    }

    obj.lineHeight = obj.lineHeightUnit + '.' + obj.lineHeightMili;
  }

  onChangeVideoUrl() {
    //const video = document.querySelector<HTMLElement>('#video-id-'+this.bannerSelect.id);
    //video.innerHTML = '<video controls><source src="'+this.bannerSelect.video.url+'" type="video/mp4"></video>';
    this.onChangeItem();
    this.bannerSelect.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(this.bannerSelect.video.url);

    //var player = document.querySelector<HTMLElement>('#video-id-'+this.bannerSelect.id +' video');
    //var mp4Vid = document.querySelector<HTMLElement>('#video-id-'+this.bannerSelect.id +' video source');

    //    mp4Vid.src = this.bannerSelect.video.url;
    //player.load();
    //player.play();
  }

  async presentActionAddCarrousel() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tipo de elemento a agregar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Imágen',
        role: 'destructive',
        icon: 'image-outline',
        handler: () => {
          this.onAddImgCarousel();
        }
      }, {
        text: 'Lista de productos',
        icon: 'albums-outline',
        handler: () => {
          this.presentProductListCarousel();
        }
      }, {
        text: 'Producto',
        icon: 'browsers-outline',
        handler: () => {
          //console.log('Play clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();

  }

  onChangeImage() {
    let img = new Image();
    const _self = this;
    img.onload = function () {
      const _selfImg: any = this;
      _self.bannerSelect.size.x = _selfImg.width;
      _self.bannerSelect.size.y = _selfImg.height;
    }
    img.src = this.bannerSelect.image_url;
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }


  initializeProductCatalogs(banner) {

    banner.__productCatalogList = { "products": [] };
    banner.__factor = 3;
    let remark = banner.productCatalog.list;

    let str = remark.split(';')[0];
    const pavilion = str.split(':')[1];
    str = remark.split(';')[1];
    const stand = str.split(':')[1];
    str = remark.split(';').length == 3 ? remark.split(';')[2] : null;
    const category = str ? str.split(':')[1] : '';

    this.productsService.get(this.fair.id, pavilion, stand, null)
      .then((products) => {
        if (products.length > 0) {
          products.forEach((product) => {
            if (category == 'all' || product.category_id == category) {
              product.url_image = product.resources && product.resources.main_url_image ? product.resources.main_url_image : product.prices[0].resources.images[0].url_image;
              banner.__productCatalogList.products.push(product);
              product.priceSelected = product.prices[0];
              product.priceSelectedIndex = 0;
            }
          });
        }

        this.resizeProductCatalogs(banner);
      })
      .catch(error => {

      });
  }

  resizeProductCatalogs(banner) {
    for (var i = 10; i > 0; i--) {
      if ((banner.position.x + i * banner.size.x <= this.scene.container.w) ||
        (banner.position.x + (i - 1.3) * banner.size.x <= this.scene.container.w)) {
        banner.__factor = i - 1;
        break;
      }
    }
    banner.__productCatalogList.products.forEach((product, i: any) => {
      product.top = ((Math.floor(i / banner.__factor) * banner.size.y) + (banner.size.y * Math.floor(i / banner.__factor) * 0.03));
      product.left = ((Math.floor(i % banner.__factor) * 1.03) * banner.size.x);
    });

    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    let left = main.offsetWidth - (((banner.__factor) * 1.03) * banner.size.x);
    if (left <= 0) left = 10;
    const bannerDom = document.querySelector<HTMLElement>('#banner-drag-' + banner.id);
    if (bannerDom) bannerDom.style.left = (left / 2) + 'px';
  }

  initializeAgendaCatalogs(banner) {

    banner.__agendaCatalogList = { "agendas": [], "groups": [] };
    banner.__factor = 3;

    const category = banner.agendaCatalog.category || 'all';

    this.agendasService.list(null)
      .then((agendas) => {
        if (agendas.length > 0) {
          agendas.forEach((agenda) => {
            if (category == 'all' || agenda.category_id == category) {
              banner.__agendaCatalogList.agendas.push(agenda);
            }
          });

          this.transformSchedule(banner);
        }
        this.resizeAgendaCatalogs(banner);
      })
      .catch(error => {
        console.log(error);
      });
  }

  c

  resizeAgendaCatalogs(banner) {
    for (var i = 10; i > 0; i--) {
      if ((banner.position.x + i * banner.size.x <= this.scene.container.w) ||
        (banner.position.x + (i - 1.3) * banner.size.x <= this.scene.container.w)) {
        banner.__factor = i - 1;
        break;
      }
    }
    banner.__agendaCatalogList.groups.forEach((group, i: any) => {
      group.top = ((Math.floor(i / banner.__factor) * banner.size.y) + (banner.size.y * Math.floor(i / banner.__factor) * 0.03));
      group.left = ((Math.floor(i % banner.__factor) * 1.03) * banner.size.x);
    });

    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    let left = main.offsetWidth - (((banner.__factor) * 1.03) * banner.size.x);
    if (left <= 0) left = 10;
    const bannerDom = document.querySelector<HTMLElement>('#banner-drag-' + banner.id);
    if (bannerDom) bannerDom.style.left = (left / 2) + 'px';
  }

  changePriceProductCatalog(product, banner) {
    setTimeout(() => {
      if (this.carouselSlides && this.carouselSlides._results) {
        this.carouselSlides._results.forEach((elm) => {
          elm.ionSlideChange(elm);
        });
      }
    }, 5);
  }

  initializeSpeakers(banner) {

    banner.__speakerCatalogList = [];
    banner.speakerCatalog.speakerType = banner.speakerCatalog.speakerType || 'Conferencista';
    if (this.speakerList.length == 0) {
      this.speakersService.list()
        .then((speakers) => {
          banner.__factor = banner.__factor || 3;
          this.speakerList = speakers;
          this.filterSpeakerList(banner);
          this.onChangeSpeakerStyle(banner);
          this.resizeSpeakers(banner);
        })
        .catch(error => {

        });
    }
    else {

      this.filterSpeakerList(banner);
      this.onChangeSpeakerStyle(banner);
      this.resizeSpeakers(banner);

    }

  }

  resizeSpeakers(banner) {
    for (let i = 10; i > 0; i--) {
      if ((banner.position.x + i * banner.size.x <= this.scene.container.w) ||
        (banner.position.x + (i - 1.3) * banner.size.x <= this.scene.container.w)) {
        banner.__factor = i - 1;
        break;
      }
    }

    banner.__speakerCatalogList.forEach((speaker, i: any) => {
      speaker.top = ((Math.floor(i / banner.__factor) * banner.size.y) + (banner.size.y * Math.floor(i / banner.__factor) * 0.03));
      speaker.left = ((Math.floor(i % banner.__factor) * 1.03) * banner.size.x);
    });

    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    const left = main.offsetWidth - (((banner.__factor) * 1.03) * banner.size.x);
    const bannerDom = document.querySelector<HTMLElement>('#banner-drag-' + banner.id);
    if (bannerDom) bannerDom.style.left = (left / 2) + 'px';
  }


  goToEditProduct(product) {
    const uri = '/super-admin/product/' + product.stand.pavilion_id + '/' + product.stand_id + '/' + product.id;
    this.router.navigate([uri])
  }

  onHistoryBack() {
    this.historySel--;
    this.scene = this.historyList[this.historySel];
  }

  onHistoryNext() {
    this.historySel++;
    this.scene = this.historyList[this.historySel];
  }

  onBackdropEditMode() {
    this.editModeBackdrop = true;
    window.dispatchEvent(new CustomEvent('map:fullscreenIn'));
  }

  async presentActionProduct(product) {

    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Ver detalle',
        role: 'destructive',
        cssClass: 'customCSSClass',
        handler: () => {
          this.onShowProduct(product);
        }
      }, {
        text: 'Editar producto',
        role: 'destructive',
        handler: () => {
          window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
          this.goToEditProduct(product);
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();

  }

  async onShowProduct(product) {
    const modal = await this.modalCtrl.create({
      component: ProductDetailComponent,
      swipeToClose: false,
      cssClass: 'product-modal',
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'fair': this.fair, 'pavilionId': product.stand.pavilion_id, 'standId': product.stand_id, 'product': product }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {

    }
  }

  async presentMapEditorBanner(banner) {
    const modal = await this.modalCtrl.create({
      component: BannerEditorComponent,
      swipeToClose: true,
      //backdropDismiss:false,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }

  onChangeBackgroundStyle() {
    let ionContent = document.querySelector('#ionContent');
    if (this.scene && this.scene.backgroundColor) {
      ionContent.setAttribute("style", "--background:" + this.scene.backgroundColor);
    }
    else if (this.scene && this.scene.url_image) {
      ionContent.setAttribute("style", "--background:none");
      //ionContent.setAttribute("style","background-repeat:" + 'no-repeat;' + "background-size:" + '100% 100%;' + "--background:" + 'url(' + this.scene.url_image + '); ' );
      //ionContent.setAttribute("style","--background:" + "#fff url('" + this.scene.url_image + "') no-repeat center center / cover");
    }
  }

  logScrolling($event) {

  }

  changeEditSave(editSave) {
    this.editSave = editSave;
    if (editSave) {
      window.dispatchEvent(new CustomEvent('side-menu-button:edit-save-on'));
    } else {
      window.dispatchEvent(new CustomEvent('side-menu-button:edit-save-off'));
    }
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  _getId() {
    let id = new Date().valueOf() + Math.floor(Math.random() * (1000 + 1));
    alert(id);
    return id;
  }

  transformSchedule(banner) {

    const months = ['Ene', 'Feb', 'Marzo', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let groups = null;
    let agendas = null;
    if (banner.__formCatalog) {
      groups = banner.__formCatalog.groups;
      agendas = banner.__formCatalog.agendas;
    }

    if (banner.__agendaCatalogList) {
      groups = banner.__agendaCatalogList.groups;
      agendas = banner.__agendaCatalogList.agendas;
    }

    for (let agenda of agendas) {

      agenda.hide = false;

      const timeZone = moment(agenda.start_at);
      const strHour = this.datepipe.transform(new Date(agenda.start_at), 'hh');
      const strMinutes = timeZone.format('mm');

      const time = timeZone.format('YYYY-MM-DD');
      const month = Number(timeZone.format('MM'));
      const strSignature = Number(timeZone.format('HH')) > 12 ? 'PM' : 'AM';
      const strYear = timeZone.format('YYYY');
      const strMonth = months[month - 1];
      const strDay = timeZone.format('DD');

      let groupTemp = null;
      for (let group of groups) {
        if (group.time === time) {
          groupTemp = group;
          break;
        }
      }
      if (!groupTemp) {
        groupTemp = {
          time: time,
          strDay: strDay,
          month: strMonth + ' ' + strYear,
          sessions: []
        };
        groups.push(groupTemp);
      }

      const endHour = moment(agenda.start_at).add(agenda.duration_time, 'milliseconds').format('hh:mm a');

      const location = agenda.room ? agenda.room.name : '';

      groupTemp.sessions.push(
        Object.assign({
          name: agenda.title,
          startTime: strHour + ':' + strMinutes,
          endTime: endHour,
          time: time,
          hour: strHour,
          minutes: strMinutes,
          signature: strSignature,
          month: strMonth + ' ' + strYear,
          location: location,
        }, agenda));
    }

  }

  filterSpeakerList(banner) {

    console.log(banner.speakerCatalog.speakerType);
    banner.__speakerCatalogList =
      this.speakerList.filter((speaker) => {
        let mbControl = false;
        for (let cat of banner.speakerCatalog.speakerType.split(',')) {
          if (speaker.position == cat) {
            mbControl = true;
          }
        }
        return mbControl;

      });
  }

  initSpeakerTypeList() {
    this.categoryService.list('SpeakerCategory', this.fair).then((response) => {
      if (response.success == 201) {
        this.speakerTypeList = [];

        for (let type of response.data) {
          this.speakerTypeList.push({ "type": type.name, "label": type.name });
        }
      }
      else {
        this.errors = `Consultando las categorias de conferencistas`;
      }
    });   

    this.speakersService.list()
        .then((speakers) => {
          this.speakerList = speakers; 
        })
        .catch(error => {

        });
  }

  reload() {
    setTimeout(() => { window.location.reload(); }, 100);
  }
}
