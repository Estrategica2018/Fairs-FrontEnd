import { Component, ElementRef,QueryList, ViewChild, ViewChildren, OnInit} from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../../api/fairs.service';
import { PavilionsService } from './../../../api/pavilions.service';
import { ProductsService } from './../../../api/products.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { AdminPavilionsService } from './../../../api/admin/pavilions.service';
import { AdminStandsService } from './../../../api/admin/stands.service';
import { AdminProductsService } from './../../../api/admin/products.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './../../../providers/loading.service';
import { PanelEditorComponent } from './panel-editor/panel-editor.component';
import { AlertController, ModalController, IonRouterOutlet,ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
import { processData } from '../../../providers/process-data';
import { TabMenuScenesComponent } from '../../map/tab-menu-scenes/tab-menu-scenes.component';
import { IonReorderGroup } from '@ionic/angular'; 
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { PopoverController, ActionSheetController  } from '@ionic/angular';
import { environment, SERVER_URL } from '../../../../environments/environment';
import { ProductListComponent } from '../../super-admin/map-editor/product-list/product-list.component';

declare var tinymce;

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.page.html',
  styleUrls: ['./map-editor.page.scss'],
})
export class MapEditorPage implements OnInit {

  url: string;
  @ViewChild('videoMeeting', { static: true }) videoElement: ElementRef;
  @ViewChildren('carrousel') carrousels: any;    
  @ViewChildren('productCatalog') productCatalogs: any;    
  @ViewChild('menuTabs', { static: true }) menuTabs: TabMenuScenesComponent;
  errors = null;
  success = null;
  fixedBannerPanel = true;
  moveMouseEvent: any;
  tabMenuOver = false;
  fullScreen = false;
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
  panelPos = { x: '27px', y: '0px' };
  mainObj = null;
  resources = null;
  sceneId = null;
  objId = null;
  scene = null;
  template = null;
  showTool = null;
  tabSelect = 'position';
  showPanelTool = null;
  htmlEditor = {obj: null, idType: null};
  isHover = null;
  bannerCopy = [];
  showHtmlEditor = false;
  tabMenuObj:any;
  tabMenuInstance: any = null;
  bannerSelectHover = null;
  hoverEffects = [ {"name":"GirarDerecha","isChecked":false},{"name":"GirarIzquierda","isChecked":false}];
  groupOfLinks = [];
  copyMultiFromList = [];
  lineHeightMili = null;
  lineHeightUnit = null;
  selectionElementList = null;
  showlogScrolling = false;
  
  borderStyles = ["none","dotted","dashed","solid","double","groove","ridge","inset","outset","hidden"];
  toolTipArrowStyles = [{"label":"Arrow Up","value":"arrow--1"},{"label":"Array left","value":"arrow--2"},{"label":"Arrow Down","value":"arrow--3"},{"label":"Arrow right","value":"arrow--4"},
                        {"label":"Arrow Up Inside","value":"arrow--5"},{"label":"Array left Inside","value":"arrow--6"},{"label":"Arrow Down Inside","value":"arrow--7"},{"label":"Arrow right Inside","value":"arrow--8"}];
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
  menuIcons = ["accessibility-outline","add-outline","add-circle-outline","airplane-outline","alarm-outline","albums-outline","alert-outline","alert-circle-outline","american-football-outline","analytics-outline","aperture-outline","apps-outline","archive-outline","arrow-back-outline","arrow-back-circle-outline","arrow-down-outline","arrow-down-circle-outline","arrow-forward-outline","arrow-forward-circle-outline","arrow-redo-outline","arrow-redo-circle-outline","arrow-undo-outline","arrow-undo-circle-outline","arrow-up-outline","arrow-up-circle-outline","at-outline","at-circle-outline","attach-outline","backspace-outline","bag-outline","bag-add-outline","bag-check-outline","bag-handle-outline","bag-remove-outline","balloon-outline","ban-outline","bandage-outline","bar-chart-outline","barbell-outline","barcode-outline","baseball-outline","basket-outline","basketball-outline","battery-charging-outline","battery-dead-outline","battery-full-outline","battery-half-outline","beaker-outline","bed-outline","beer-outline","bicycle-outline","bluetooth-outline","boat-outline","body-outline","bonfire-outline","book-outline","bookmark-outline","bookmarks-outline","bowling-ball-outline","briefcase-outline","browsers-outline","brush-outline","bug-outline","build-outline","bulb-outline","bus-outline","business-outline","cafe-outline","calculator-outline","calendar-outline","calendar-clear-outline","calendar-number-outline","call-outline","camera-outline","camera-reverse-outline","car-outline","car-sport-outline","card-outline","caret-back-outline","caret-back-circle-outline","caret-down-outline","caret-down-circle-outline","caret-forward-outline","caret-forward-circle-outline","caret-up-outline","caret-up-circle-outline","cart-outline","cash-outline","cellular-outline","chatbox-outline","chatbox-ellipses-outline","chatbubble-outline","chatbubble-ellipses-outline","chatbubbles-outline","checkbox-outline","checkmark-outline","checkmark-circle-outline","checkmark-done-outline","checkmark-done-circle-outline","chevron-back-outline","chevron-back-circle-outline","chevron-down-outline","chevron-down-circle-outline","chevron-forward-outline","chevron-forward-circle-outline","chevron-up-outline","chevron-up-circle-outline","clipboard-outline","close-outline","close-circle-outline","cloud-outline","cloud-circle-outline","cloud-done-outline","cloud-download-outline","cloud-offline-outline","cloud-upload-outline","cloudy-outline","cloudy-night-outline","code-outline","code-download-outline","code-slash-outline","code-working-outline","cog-outline","color-fill-outline","color-filter-outline","color-palette-outline","color-wand-outline","compass-outline","construct-outline","contract-outline","contrast-outline","copy-outline","create-outline","crop-outline","cube-outline","cut-outline","desktop-outline","diamond-outline","dice-outline","disc-outline","document-outline","document-attach-outline","document-lock-outline","document-text-outline","documents-outline","download-outline","duplicate-outline","ear-outline","earth-outline","easel-outline","egg-outline","ellipse-outline","ellipsis-horizontal-outline","ellipsis-horizontal-circle-outline","ellipsis-vertical-outline","ellipsis-vertical-circle-outline","enter-outline","exit-outline","expand-outline","extension-puzzle-outline","eye-outline","eye-off-outline","eyedrop-outline","fast-food-outline","female-outline","file-tray-outline","file-tray-full-outline","file-tray-stacked-outline","film-outline","filter-outline","filter-circle-outline","finger-print-outline","fish-outline","fitness-outline","flag-outline","flame-outline","flash-outline","flash-off-outline","flashlight-outline","flask-outline","flower-outline","folder-outline","folder-open-outline","football-outline","footsteps-outline","funnel-outline","game-controller-outline","gift-outline","git-branch-outline","git-commit-outline","git-compare-outline","git-merge-outline","git-network-outline","git-pull-request-outline","glasses-outline","globe-outline","golf-outline","grid-outline","hammer-outline","hand-left-outline","hand-right-outline","happy-outline","hardware-chip-outline","headset-outline","heart-outline","heart-circle-outline","heart-dislike-outline","heart-dislike-circle-outline","heart-half-outline","help-outline","help-buoy-outline","help-circle-outline","home-outline","hourglass-outline","ice-cream-outline","id-card-outline","image-outline","images-outline","infinite-outline","information-outline","information-circle-outline","invert-mode-outline","journal-outline","key-outline","keypad-outline","language-outline","laptop-outline","layers-outline","leaf-outline","library-outline","link-outline","list-outline","list-circle-outline","locate-outline","location-outline","lock-closed-outline","lock-open-outline","log-in-outline","log-out-outline","magnet-outline","mail-outline","mail-open-outline","mail-unread-outline","male-outline","male-female-outline","man-outline","map-outline","medal-outline","medical-outline","medkit-outline","megaphone-outline","menu-outline","mic-outline","mic-circle-outline","mic-off-outline","mic-off-circle-outline","moon-outline","move-outline","musical-note-outline","musical-notes-outline","navigate-outline","navigate-circle-outline","newspaper-outline","notifications-outline","notifications-circle-outline","notifications-off-outline","notifications-off-circle-outline","nuclear-outline","nutrition-outline","open-outline","options-outline","paper-plane-outline","partly-sunny-outline","pause-outline","pause-circle-outline","paw-outline","pencil-outline","people-outline","people-circle-outline","person-outline","person-add-outline","person-circle-outline","person-remove-outline","phone-landscape-outline","phone-portrait-outline","pie-chart-outline","pin-outline","pint-outline","pizza-outline","planet-outline","play-outline","play-back-outline","play-back-circle-outline","play-circle-outline","play-forward-outline","play-forward-circle-outline","play-skip-back-outline","play-skip-back-circle-outline","play-skip-forward-outline","play-skip-forward-circle-outline","podium-outline","power-outline","pricetag-outline","pricetags-outline","print-outline","prism-outline","pulse-outline","push-outline","qr-code-outline","radio-outline","radio-button-off-outline","radio-button-on-outline","rainy-outline","reader-outline","receipt-outline","recording-outline","refresh-outline","refresh-circle-outline","reload-outline","reload-circle-outline","remove-outline","remove-circle-outline","reorder-four-outline","reorder-three-outline","reorder-two-outline","repeat-outline","resize-outline","restaurant-outline","return-down-back-outline","return-down-forward-outline","return-up-back-outline","return-up-forward-outline","ribbon-outline","rocket-outline","rose-outline","sad-outline","save-outline","scale-outline","scan-outline","scan-circle-outline","school-outline","search-outline","search-circle-outline","send-outline","server-outline","settings-outline","shapes-outline","share-outline","share-social-outline","shield-outline","shield-checkmark-outline","shield-half-outline","shirt-outline","shuffle-outline","skull-outline","snow-outline","sparkles-outline","speedometer-outline","square-outline","star-outline","star-half-outline","stats-chart-outline","stop-outline","stop-circle-outline","stopwatch-outline","storefront-outline","subway-outline","sunny-outline","swap-horizontal-outline","swap-vertical-outline","sync-outline","sync-circle-outline","tablet-landscape-outline","tablet-portrait-outline","telescope-outline","tennisball-outline","terminal-outline","text-outline","thermometer-outline","thumbs-down-outline","thumbs-up-outline","thunderstorm-outline","ticket-outline","time-outline","timer-outline","today-outline","toggle-outline","trail-sign-outline","train-outline","transgender-outline","trash-outline","trash-bin-outline","trending-down-outline","trending-up-outline","triangle-outline","trophy-outline","tv-outline","umbrella-outline","unlink-outline","videocam-outline","videocam-off-outline","volume-high-outline","volume-low-outline","volume-medium-outline","volume-mute-outline","volume-off-outline","walk-outline","wallet-outline","warning-outline","watch-outline","water-outline","wifi-outline","wine-outline","woman-outline","logo-alipay","logo-amazon","logo-amplify","logo-android","logo-angular","logo-apple","logo-apple-appstore","logo-apple-ar","logo-behance","logo-bitbucket","logo-bitcoin","logo-buffer","logo-capacitor","logo-chrome","logo-closed-captioning","logo-codepen","logo-css3","logo-designernews","logo-deviantart","logo-discord","logo-docker","logo-dribbble","logo-dropbox","logo-edge","logo-electron","logo-euro","logo-facebook","logo-figma","logo-firebase","logo-firefox","logo-flickr","logo-foursquare","logo-github","logo-gitlab","logo-google","logo-google-playstore","logo-hackernews","logo-html5","logo-instagram","logo-ionic","logo-ionitron","logo-javascript","logo-laravel","logo-linkedin","logo-markdown","logo-mastodon","logo-medium","logo-microsoft","logo-no-smoking","logo-nodejs","logo-npm","logo-octocat","logo-paypal","logo-pinterest","logo-playstation","logo-pwa","logo-python","logo-react","logo-reddit","logo-rss","logo-sass","logo-skype","logo-slack","logo-snapchat","logo-soundcloud","logo-stackoverflow","logo-steam","logo-stencil","logo-tableau","logo-tiktok","logo-tumblr","logo-tux","logo-twitch","logo-twitter","logo-usd","logo-venmo","logo-vercel","logo-vimeo","logo-vk","logo-vue","logo-web-component","logo-wechat","logo-whatsapp","logo-windows","logo-wordpress","logo-xbox","logo-xing","logo-yahoo","logo-yen"];
  textAligns = [{"value":"center","label":"Centrado"},{"value":"justify","label":"Justificado"},{"value":"right","label":"Derecha"},{"value":"left","label":"Izquierda"}];
  lineTypes = [{"value":"dashed","label":"Cortada"},{"value":"solid","label":"Sólida"},{"value":"dotted","label":"Punteada"},{"value":"double","label":"Doble"},{"value":"groove","label":"Sombreada"},{"value":"hidden","label":"Oculta"},]
  internalUrlList: any;
  typeCarouselList = [{'label':'Horizontal','value':'horizontal'}, {'label':'Horizontal 1','value':'horizontal-1'},{'label':'Horizontal 2','value':'horizontal-2'}];
  carouselOptionList = ['slidesPerView','rotate','stretch','depth','modifier'];
  
  constructor(
    private alertCtrl: AlertController,
    private fairsService: FairsService,
    private pavilionsService: PavilionsService,
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
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private productsService: ProductsService,
    private popoverCtrl: PopoverController,
    private actionSheetController: ActionSheetController) { 
      
      this.listenForFullScreenEvents();
      this.initializePanel();
      //this.url = SERVER_URL;
      this.url = window.location.origin;
  }

  ngOnInit() {
    const div = document.querySelector<HTMLElement>('.div-container');
  } 
  
  ngOnDestroy(): void {
     if(window.location.href.indexOf('/#/super-admin/map-editor/') < 0)
     window.dispatchEvent(new CustomEvent( 'map:fullscreenOff'));

  } 
  ngAfterViewInit() {
     this.initializeScreen();
  }

  ngDoCheck(){
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
     main.style.top = top + 'px';
     const div = document.querySelector<HTMLElement>('.div-container');
     div.style.height = ( window.innerHeight - top )  + 'px';
  }
   
   initializeScreen() {
     this.bannerSelect = null; 
     this.loading.present({message:'Cargando...'});
     const url = window.location.href;
     this.template = url.indexOf('super-admin/map-editor/fair')  >= 0 ? 'fair' : 
     url.indexOf('super-admin/map-editor/pavilion')  >= 0 ? 'pavilion' :
     url.indexOf('super-admin/map-editor/stand')  >= 0 ? 'stand' : 
	 url.indexOf('super-admin/map-editor/product')  >= 0 ? 'product' : 
	 '';
     
     const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
     const standId = this.route.snapshot.paramMap.get('standId');
	 const productId = this.route.snapshot.paramMap.get('productId');
     this.sceneId = this.route.snapshot.paramMap.get('sceneId');
     
     const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     main.style.top = top + 'px';
     const btnSave = document.querySelector<HTMLElement>('.panel-scene-save');
     const panelPosX = ( main.offsetWidth - btnSave.offsetWidth - 600 ) + 'px';
     this.panelPos = { x: panelPosX + 'px', y: '0px' };
     
     this.fairsService.getCurrentFair().then((fair)=>{
        
		this.fair = fair;

        if(this.template === 'fair') {
			
          this.resources = fair.resources;
          this.scene = this.sceneId ? fair.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
		  this.initializeScene();
        }
        else if(this.template === 'pavilion') {
			
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId) {
                this.pavilion = pavilion;
                this.resources = pavilion.resources;
                this.scene = this.sceneId ? this.pavilion.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
		        this.initializeScene();
              }
          });
        }
        else if(this.template === 'stand') {
          
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId) {
                this.pavilion = pavilion;
                pavilion.stands.forEach((standEl)=>{
                   if(standEl.id == standId) {
                      this.stand = standEl;
                      this.resources = this.stand.resources;
                      this.scene = this.sceneId ? this.stand.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
		              this.initializeScene();
                   }
                });
              }
          });
        }
		else if(this.template === 'product') {
          
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId) {
                this.pavilion = pavilion;
                pavilion.stands.forEach((standEl)=>{
                   if(standEl.id == standId) {
                      this.stand = standEl;
                      this.productsService.get(this.fair.id,this.pavilion.id,this.stand.id,productId)
					  .then((products) => {
						if(products.length > 0) {
						   this.product = products[0];
						}
						this.resources = this.product.resources || { 'scenes': []};
                        this.scene = this.sceneId ? this.product.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
		                this.initializeScene();
					  })
					  .catch(error => {
						this.errors = error;
					  });
                   }
                });
              }
          });
        }
     }, error => {
        this.loading.dismiss();
        this.errors = `Consultando el servicio del mapa general de la feria ${error}`;
     });
        
  }
  
  initializeScene(){
	this.scene.menuTabs = this.scene.menuTabs ||  { 'showMenuParent': true };
	this.resources.menuTabs = this.resources.menuTabs || {};

	this.scene.banners = this.scene.banners || [];
	this.scene.banners.forEach((banner)=>{
		if(banner.video)
		banner.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(banner.video.url);
	});

	this.initializeHtmlTexts(this.scene.banners);
	this.initializeInternalUrl();
    this.initializeGroupOfLinks();

	setTimeout(() => {
	  this.loading.dismiss();
	  this.initializeCarousels();
	  this.initializeProductCatalogs();
	}, 5);
	
	if(this.scene.menuTabs.showMenuParent) {
	   this.tabMenuObj = Object.assign({}, this.resources.menuTabs);
	}
	else {
		this.tabMenuObj = this.scene.menuTabs;
	}
	this.onResize();
  }
  
  initializeHtmlTexts(banners) {
      banners.forEach((banner)=>{
          banner.textHtml = this.sanitizer.bypassSecurityTrustHtml(banner.text);
      });
  }  

  initializeCarousels() {
    if(this.carrousels && this.carrousels._results ) {
        this.carrousels._results.forEach((elm)=>{
            elm.initialize();
			elm.onResize();
        });
    }    
  }  

  initializeProductCatalogs() {
    if(this.productCatalogs && this.productCatalogs._results ) {
        this.productCatalogs._results.forEach((elm)=>{
            elm.initialize();
			elm.onResize();
        });
    }    
  }
  
  onResizeCarousels() {
    if(this.carrousels && this.carrousels._results ) {
        this.carrousels._results.forEach((elm)=>{
            elm.onResize();
        });
    }    
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));
  }
  
  onChangeOpacity() {
      const originYRange : any= document.querySelector<HTMLElement>('.origin-y-range');
      this.bannerSelect.opacity = originYRange.value / 100;
  }
  
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
  } 
  
  @HostListener('window:resize', ['$event'])
  onResize() {
      
     if(!this.scene) return;
    
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     const menu = document.querySelector < HTMLElement > ('.menu-main-content');
     const offsetWidth = window.innerWidth - menu.offsetWidth;
     const top = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
     main.style.top = top + 'px';
    
     let newWidth = offsetWidth;//main.offsetWidth;
     const offsetHeight = window.innerHeight - top;
     let deltaW =  this.scene.container.w / newWidth;
     let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
     let deltaH = this.scene.container.h / newHeight;
     
     if(newHeight < offsetHeight) {
         newHeight = window.innerHeight;
         newWidth = newHeight * this.scene.container.w / this.scene.container.h;
         deltaW =  this.scene.container.w / newWidth;
         deltaH = this.scene.container.h / newHeight;
     }
     this.scene.container.w = newWidth;
     this.scene.container.h = newHeight;
     
     this.scene.banners.forEach((banner)=>{
        if(banner.size) { 
           banner.size.x /= deltaW;
           banner.size.y /= deltaH;
        }
        if(banner.position) { 
           banner.position.x /= deltaW;
           banner.position.y /= deltaH;
        }
        if(banner.fontSize > 0 ) {
           banner.fontSize /= deltaW;
        }
        
     });
     
     //Menu tab resize/render
     this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);

     //carrete of images resize/render
     this.onResizeCarousels();
     
  }
/*
logScrollStart() {this.showlogScrolling = true;}
logScrollEnd() {this.showlogScrolling = false;}

  logScrolling(e) {
      let target = e.target;
      const scrollLeft = target.scrollLeft;
      const scrollTop = target.scrollTop;
      const oldScrollX = Number(target.getAttribute('scroll-x'));
      const oldScrollY = Number(target.getAttribute('scroll-y'));
      const deltaX = scrollLeft - oldScrollX;
      const deltaY = scrollTop - oldScrollY;
      
      document.querySelectorAll('.banner').forEach((banner:HTMLElement) => {
          banner.style.left = ( banner.offsetLeft - deltaX ) + 'px';  
          banner.style.top  = ( banner.offsetTop - deltaY ) + 'px';
      });
      
      document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-x',scrollLeft.toString());
      document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-y',scrollTop.toString());
  }
 */ 
  onBannerSelect(bannerSelect) {
      this.bannerSelect = bannerSelect;
      this.bannerSelect.hoverEffects = this.bannerSelect.hoverEffects || '';
      this.hoverEffects.forEach((effect)=>{
         effect.isChecked = this.bannerSelect.hoverEffects.includes(effect.name);
      });
      this.showPanelTool = 'settingsBanner';
      this.bannerSelect.lineHeight = this.bannerSelect.lineHeight || '1.0';
      this.lineHeightUnit = Number.parseInt(this.bannerSelect.lineHeight);
      this.lineHeightMili = this.bannerSelect.lineHeight.split('.')[1];
      this.isHover = bannerSelect.id; 
  }
  
  onChangeItem() {
      this.editSave = true;
  }
  
  initializePanel() {
      const inputs = Array.from(document.querySelectorAll('.input-form'));
      inputs.forEach((input) => {
          input.addEventListener('ionInput', this.onChangeItem);
      });
  }
  
  onSave() {
      this.loading.present({message:'Cargando...'});
      if(this.sceneId) {
         this.resources.scenes[this.sceneId] = this.scene;
      }
      else {
         this.resources.scenes = this.resources.scenes || [];
         this.resources.scenes.push(this.scene);
      }
      
      if(this.editMenuTabSave && this.scene.menuTabs.showMenuParent) {
          this.resources.menuTabs = this.tabMenuObj;
      }
      
      if(this.template === 'fair') {
          this.fair.resources = this.resources;
          this.adminFairsService.update(this.fair)
          .then((response) => {
              this.loading.dismiss();
              this.success= `Escena modificada correctamentes`;
              this.fairsService.refreshCurrentFair();
              if(!this.sceneId) {
                  this.resources = processData(response.data_fair.resources);
                  this.sceneId = this.resources.scenes.length - 1;
                  this.editMenuTabSave = null;
                  this.editSave = null;
                  this.showPanelTool = false
                  this.bannerSelect = null;
                  window.location.replace(`${this.url}/#/super-admin/map-editor/fair/${this.sceneId}`);
              }
              this.ngOnInit();
              this.errors = null;
           })
           .catch(error => {
               this.loading.dismiss();
               this.errors = `Consultando el servicio para actualizar feria ${error}`;
           });
      }
      else if(this.template === 'pavilion') {
          this.pavilion.resources = this.resources;
          this.adminPavilionsService.update(this.pavilion)
          .then((pavilion) => {
              this.loading.dismiss();
              this.errors = null;
              if(!this.sceneId) {
                  this.resources = processData(pavilion.resources);
                  this.sceneId = this.resources.scenes.length - 1;
              }
              this.fairsService.refreshCurrentFair();
              this.pavilionsService.refreshCurrentPavilion();
              this.editMenuTabSave = null;
              this.editSave = null;
              this.showPanelTool = false
              this.bannerSelect = null;
              window.location.replace(`${this.url}/#/super-admin/map-editor/pavilion/${this.pavilion.id}/${this.sceneId}`);
              //this.router.navigateByUrl(`/super-admin/map-editor/pavilion/${this.pavilion.id}/${this.sceneId}`);
           })
           .catch(error => {
               this.loading.dismiss();
               this.errors = `Consultando el servicio para actualizar pabellón ${error}`;
           });
      }
      else if(this.template === 'stand') {
          this.stand.resources = this.resources;
          this.adminStandsService.update(this.stand)
          .then((stand) => {
              this.loading.dismiss();
              if(!this.sceneId) {
                  this.sceneId = this.resources.scenes.length - 1;
              }
              this.fairsService.refreshCurrentFair();
              this.pavilionsService.refreshCurrentPavilion();
              this.errors = null;
              this.editMenuTabSave = null;
              this.editSave = null;
              this.showPanelTool = false
              this.bannerSelect = null;
              window.location.replace(`${this.url}/#/super-admin/map-editor/stand/${this.pavilion.id}/${this.stand.id}/${this.sceneId}`);
              //this.router.navigateByUrl(`/super-admin/map-editor/stand/${this.pavilion.id}/${this.stand.id}/${this.sceneId}`);
           })
           .catch(error => {
               this.loading.dismiss(); 
               this.errors = `Consultando el servicio para actualizar local comercial ${error}`;
           });
      }
	  else if(this.template === 'product') {
          this.product.resources = this.resources;
		  this.adminProductsService.update(Object.assign({'fair_id':this.fair.id,'pavilion_id':this.pavilion.id,'stand_id':this.stand.id},this.product))
          .then((product) => {
              this.loading.dismiss();
              if(!this.sceneId) {
                  this.sceneId = this.resources.scenes.length - 1;
              }
              this.errors = null;
              this.editMenuTabSave = null;
              this.editSave = null;
              this.showPanelTool = false
              this.bannerSelect = null;
              window.location.replace(`${this.url}/#/super-admin/map-editor/product/${this.pavilion.id}/${this.stand.id}/${this.product.id}/${this.sceneId}`);
              //this.router.navigateByUrl(`/super-admin/map-editor/product/${this.pavilion.id}/${this.stand.id}/${this.product.id}/${this.sceneId}`);
           })
           .catch(error => {
               this.loading.dismiss(); 
               this.errors = `Consultando el servicio para actualizar producto ${error}`;
           });
      }
  }
  
  onSaveTabMenu(){
      this.resources.menuTabs = this.resources.menuTabs || {'actions':[]};
      this.resources.menuTabs.actions = this.resources.menuTabs.actions || [];
      if(this.scene.menuTabs.showMenuParent) {
          if(this.tabMenuInstance.isNew) {
              this.tabMenuInstance.isNew = false;
              this.tabMenuInstance.tabId = this.resources.menuTabs.actions.length + 1;
              this.resources.menuTabs.actions.push(this.tabMenuInstance);
          }
          this.tabMenuObj = this.resources.menuTabs;
      }
      else {
          if(this.tabMenuInstance.isNew) {
              this.tabMenuInstance.isNew = false;
              this.tabMenuInstance.tabId = this.scene.menuTabs.actions.length + 1;
              this.scene.menuTabs.actions.push(this.tabMenuInstance);
              this.tabMenuObj = this.scene.menuTabs;
          }
      }
      this.editSave = true;
      this.onChangeMenuTabs();
  }
  
  addArrowLineCurve() {
    const id = new Date().valueOf();
    const banner = {"style": "container-arrow--curve","line":{"weight":"4","type":"dashed"},"fontColor":"#000000","backgroundColor":"#ffff00","position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id};
    this.scene.banners.push(banner);
    this.editSave = true;
  }

  addArrowLineRect() {
    const id = new Date().valueOf();
    const banner = {"style":"container-arrow--rect","line":{"weight":"4","type":"dashed"},"fontColor":"#000000","backgroundColor":"#ffff00","position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id};
    this.scene.banners.push(banner);
    this.editSave = true;
  }

  addArrowLineLine() {
    const id = new Date().valueOf();
    const banner = {"style":"container-arrow--line","line":{"weight":"4","type":"dashed"},"fontColor":"#000000","backgroundColor":"#ffff00","position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id};
    this.scene.banners.push(banner);
    this.editSave = true;
  }


  addBanner(type) {
    const id = new Date().valueOf();
    let banner: any;
    const _defaultBanner = {id:id,type:type,rotation:{"x":0,"y":0,"z":0},position: this.getNewPosition({"x":156,"y":195}),border:{"style":"none"},fontSize:16};
    switch(type) { 
      case 'Text':
          banner = {"textAlign":"left","fontColor":"#000000","text":"Texto aquí","size":{"x":100,"y":20}};
      break;
      case 'Image':
          banner = {"size":{"x":114,"y":105},"image_url": "https://dummyimage.com/114x105/EFEFEF/000.png"};
      break;
      case 'Carrete':
          const allImages = [
            { "size":{"x":50,"y":88},"title": "We are covered", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/covered.jpg" },
            { "size":{"x":50,"y":88},"title": "Generation Gap", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/generation.jpg" },
            { "size":{"x":50,"y":88},"title": "Potter Me", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/potter.jpg" },
            { "size":{"x":50,"y":88},"title": "Pre-School Kids", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/preschool.jpg" },
            { "size":{"x":50,"y":88}, "title": "Young Peter Cech", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/soccer.jpg" }    
          ];
          banner = {"size":{"x":1156,"y":236},"carousel": { "options":{slidesPerView: 3,rotate: 0,stretch: 50,depth: 100,slideShadows: false,modifier: 1},"style":"horizontal","images": allImages}};
      break;
      case 'Video':
          banner = {"size":{"x":114,"y":105},"video": { "url":"https://player.vimeo.com/video/286898202"}};
          banner.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(banner.video.url);
      break;
	  case 'ProductCatalog':
          banner = {"size":{"x":114,"y":105},"productCatalog": {  }};
		  this.presentNewProductListCatalog(banner);
      break;
      default:
          banner = {"fontColor":"#000000","backgroundColor":"#ffff00","size":{"x":114,"y":105},
                    "border":{"style":"solid","color":"#000","radius":20,"width":1}};
      break;
    }
    
    this.scene.banners.push(Object.assign(_defaultBanner,banner));
    
    //open settingsBanner panel with last element
    this.bannerSelect = this.scene.banners[this.scene.banners.length-1];
    this.editSave = true;
    this.showPanelTool = 'settingsBanner'; 
  }
  
  async presentNewProductListCatalog(banner) {
    
    const modal = await this.modalCtrl.create({
      component: ProductListComponent,
      swipeToClose: true, 
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'template': this.template, 'fair': this.fair, 'pavilion': this.pavilion }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
        banner.productCatalog.list = data;
		this.initializeProductCatalogs();
    }
  } 
  
  getNewPosition(pos) {
      this.scene.banners.forEach((banner)=>{
          if(banner.position.x == pos.x && banner.position.y == pos.y) {
              pos = this.getNewPosition({"x":pos.x + 10,"y":pos.y + 10});
          }
      });
      return pos;
  }

  
  dragStart(event) {
    
  }
  
  dragPanelSceneSelectEnd(event) {
    const panel = document.querySelector<HTMLElement>('.panel-scene-select');
    this.panelPos.y = ( panel.offsetTop  + event.y ) + 'px';
    this.panelPos.x = ( panel.offsetLeft  + event.x ) + 'px';
  }
  
  dragBannerEnd($event,banner) {
    banner.position.y += $event.y;
    banner.position.x += $event.x;
    this.editSave = true;
  }
   
  onDeleteBanner(bannerSelect) {
    this.scene.banners = this.scene.banners.filter((banner)=>{
        return bannerSelect != banner; 
    });
    this.bannerSelect = null;
    this.showPanelTool = false;
    this.editSave = true;
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
            this.scene.banners.forEach((banner)=>{
              if(!banner.isChecked) {
                newList.push(banner);
              }
            });

            this.scene.banners = newList;
            this.editSave = true;
            this.copyMultiFromList = [];
          }
        }
      ]
    });
    await alert.present();
    
  }
  
  async onCopyBanner(itemList) {
    let id = new Date().valueOf();
    this.bannerCopy = [];
    itemList.forEach((banner)=>{        
       const newBanner = Object.assign({},banner);
       newBanner.id = id;
       newBanner.position = this.getNewPosition(banner.position);
       this.bannerCopy.push(newBanner);
       id ++;
    });
    
    let aux = document.createElement("input");
    aux.setAttribute("value", JSON.stringify(itemList));
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    const toast = await this.toastController.create({
      message: itemList.length > 1 ? `${itemList.length} Objetos copiados en el portapapeles` : ` 1 Objeto copiado en el portapapeles`,
      duration: 2000
    });
    toast.present();
  }
  
  onPasteBannerBtn() {
    let id = new Date().valueOf();
    this.bannerCopy.forEach((banner)=>{
       const newBanner = Object.assign({},banner);
       newBanner.id = id;
       newBanner.position = this.getNewPosition(banner.position);
       this.scene.banners.push(newBanner);
       id ++;
       this.editSave = true;
    });
    
    setTimeout(() => {
      this.initializeHtmlTexts(this.scene.banners);
    }, 5);
    
    this.bannerCopy = [];
  }
  
  listenForFullScreenEvents() {
    
    window.addEventListener('map:fullscreenOff', (e:any) => {
        setTimeout(() => {
          this.fullScreen = false;
          this.onResize();
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e:any) => {
        setTimeout(() => {
          this.fullScreen = true;
          this.onResize();
      }, 300);
    });
  }
  
  async startAnimation(obj) {

    if(!obj.hoverEffects) return;
    
    if(obj.hoverEffects.includes('GirarDerecha')) {
      const squareA = this.animationCtrl.create()
      .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))
      
      .duration(1000)
      .keyframes([
        { offset: 0, transform: 'rotate(0)' },
        { offset: 0.5, transform: 'rotate(45deg)' },
        { offset: 1, transform: 'rotate(0) '}
      ]);
      await squareA.play();
    }
    if(obj.hoverEffects.includes('GirarIzquierda')) {
      const squareA = this.animationCtrl.create()
      .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))
      
      .duration(1000)
      .keyframes([
        { offset: 0, transform: 'rotate(0)' },
        { offset: 0.5, transform: 'rotate(-45deg)' },
        { offset: 1, transform: 'rotate(0) '}
      ]);
      await squareA.play();
    }
  }
  
  onChangeEffect(effectChange) {
      
      this.bannerSelect.hoverEffects = '';
      this.hoverEffects.forEach((effect)=>{
          if( ( effect.name !== effectChange.name && effect.isChecked ) || ( effect.name === effectChange.name && !effectChange.isChecked ) ) {
             this.bannerSelect.hoverEffects += effect.name + ";";
          }
      });
      this.editSave = true;
  }
  
  async onDeleteScene(sceneId) {
    const alert = await this.alertCtrl.create({
      message: 'Confirma para eliminar la escena',
      buttons: [
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
              this.loading.present({message:'Cargando...'});
              this.resources.scenes = this.resources.scenes.filter((scene,key)=>{
                  return key != sceneId;
              });
              
              if(this.template === 'fair') {
                  this.fair.resources = this.resources;
                  this.adminFairsService.update(this.fair)
                   .then((response) => {
                       this.loading.dismiss(); 
                       this.fairsService.refreshCurrentFair();
                       window.location.replace(`${this.url}/#/super-admin/fair`);
                       //this.router.navigateByUrl(`/super-admin/fair`);
                   })
                   .catch(error => {
                       this.loading.dismiss(); 
                       this.errors = `Consultando el servicio para actualizar la feria: ${error}`;
                   });
              }
              else if(this.template === 'pavilion') {
                  this.pavilion.resources = this.resources;
                  this.adminPavilionsService.update(this.pavilion)
                   .then((response) => {
                       this.loading.dismiss(); 
                       this.fairsService.refreshCurrentFair();
                       this.pavilionsService.refreshCurrentPavilion();
                       window.location.replace(`${this.url}/#/super-admin/pavilion/${this.pavilion.id}`);
                       //this.router.navigateByUrl(`/super-admin/pavilion/${this.pavilion.id}`);
                   })
                   .catch(error => {
                       this.loading.dismiss(); 
                       this.errors = `Consultando el servicio para actualizar el pabellón: ${error}`;
                   });
               }
               else if(this.template === 'stand') {
                  this.stand.resources = this.resources;
                  this.adminStandsService.update(this.stand)
                   .then((response) => {
                       this.loading.dismiss(); 
                       this.fairsService.refreshCurrentFair();
                       //this.router.navigateByUrl(`/super-admin/stand/${this.pavilion.id}/${this.stand.id}`);
                       window.location.replace(`${this.url}/#/super-admin/stand/${this.pavilion.id}/${this.stand.id}`);
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
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
              this.tabMenuObj.actions = this.tabMenuObj.actions.filter((tab,key)=>{
                  return key != tabMenuInstance.tabId;
              });
              this.editSave = true;
          }
        }
      ]
    });
    await alert.present();
  }
  
  initializeInternalUrl() {
    this.internalUrlList = {'fair':[],'pavilions':[],'stands':[]};
    let scene, pavilion, stand;
    for(let i=0; i<this.fair.resources.scenes.length; i++) {
        scene = this.fair.resources.scenes[i];
        this.internalUrlList.fair.push({'label':'Escena - ' + (i+1), 'value':`/map/fair/${i}`});
    }
    for(let i=0; i<this.fair.pavilions.length; i++) {
        pavilion = this.fair.pavilions[i];
        for(let j=0; j<pavilion.resources.scenes.length; j++) {
            scene = pavilion.resources.scenes[j];
            this.internalUrlList.pavilions.push({'label':'Pabellón '+ pavilion.name + '. Escena - ' + (j+1), 'value':`/map/pavilion/${pavilion.id}/${j}`});
        }
        for(let j=0; j<pavilion.stands.length; j++) {
            stand = pavilion.stands[j];
            for(let j=0; j<stand.resources.scenes.length; j++) {
                scene = stand.resources.scenes[j];
                this.internalUrlList.stands.push({'label':'Local '+ stand.id + '. Escena - ' + (j+1), 'value':`/map/stand/${pavilion.id}/${stand.id}/${j}`});
            }
        }
    }
  }
  
  defaultEscene(resources) {
      const main = document.querySelector<HTMLElement>('ion-router-outlet');
      resources.scenes = resources.scenes || [];
      
      return { 'url_image': 'https://dummyimage.com/1092x768/EFEFEF/000.png', 
               'banners': [], 
               'container':  { 'w': 1092, 'h': 768 },
               'show': true,
               'menuIcon': 'map-outline', 
               'title': 'Escena #' + (resources.scenes.length + 1),
               'menuTabs': {'showMenuParent':true, 'position':'none' }}
  }
  
  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.value == e2.value : e1 == e2;
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
  
  fixedBannerPanelValidator({ x, y }: any): boolean {
    const icon = document.querySelector<HTMLElement>('#fixed-banner-icon');
    return icon.getAttribute('ng-reflect-name') === 'move-outline';
  }

  onSelectPanel(tabname) {
     if(this.showPanelTool == tabname) {
        this.showPanelTool = null;
     }
     else {
        this.showPanelTool = tabname; 
     }
  }

  onChangeColorTabMenu() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.tabs-menu.bottom::before, .tabs-menu.bottom::after {box-shadow: 0 -17px 0 0 '+this.tabMenuObj.backgroundColor+' !important}';
    style.innerHTML += '.tabs-menu .head { background-color: ' + this.tabMenuObj.backgroundColorLogo + '} ';
    style.innerHTML += '.tabs-menu.bottom .head::before, .tabs-menu.bottom .head::after { box-shadow: 0 -17px 0 0 ' + this.tabMenuObj.backgroundColorLogo + ' !important;}';
    
    document.getElementsByTagName('head')[0].appendChild(style);
    this.onChangeMenuTabs();
    this.editSave = true;
  }
  
  initializeGroupOfLinks() {

    this.groupOfLinks = [];

    let group, scene, pavilion, stand;
    group = {'label':'Escenas de Feria', 'links': []};
    for(let i=0; i<this.fair.resources.scenes.length; i++) {
        scene = this.fair.resources.scenes[i];
        group.links.push({'label':'Escena - ' + (i+1), 'value':`/map/fair/${i}`});
    }
    this.groupOfLinks.push(group);

    for(let i=0; i<this.fair.pavilions.length; i++) {
        pavilion = this.fair.pavilions[i];
        group = {'label':'Escenas de Pabellón - ' + pavilion.name , 'links': []};
        for(let j=0; j<pavilion.resources.scenes.length; j++) {
            scene = pavilion.resources.scenes[j];
            group.links.push({'label':'Escena - ' + (j+1), 'value':`/map/pavilion1/${pavilion.id}/${j}`});
        }
        this.groupOfLinks.push(group);
        
        for(let j=0; j<pavilion.stands.length; j++) {
            stand = pavilion.stands[j];
            group = {'label':'Escenas de Local - ' + stand.name , 'links': []};
            for(let j=0; j<stand.resources.scenes.length; j++) {
                scene = stand.resources.scenes[j];
                group.links.push({'label': 'Escena - ' + (j+1), 'value':`/map/stand1/${pavilion.id}/${stand.id}/${j}`});
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
    this.scene.banners.forEach((banner, key)=>{
        
        if(ev.detail.from < ev.detail.to) { //down mode
            if(key == ev.detail.to){
                list.push(banner);
                list.push(from);
            }
            else if( key < ev.detail.from || key > ev.detail.from && key < ev.detail.to || key > ev.detail.to) {
                list.push(banner);
            }
        }
        else { //up mode
            if(key == ev.detail.to){
                list.push(from);
                list.push(banner);
            }
            else if( key < ev.detail.from || key > ev.detail.from && key < ev.detail.to || key > ev.detail.to) {
                list.push(banner);
            }
        }
    });
    this.scene.banners = ev.detail.complete(this.scene.banners);
    this.editSave = true;
  } 
  
  doReorderCarousel(ev: any) {
    this.bannerSelect.carousel.images = ev.detail.complete(this.bannerSelect.carousel.images);
    this.editSave = true;
  } 
  
  toogleTabMenu() {
    this.scene.menuTabs.showMenuParent = !this.scene.menuTabs.showMenuParent;
    this.tabMenuObj = this.scene.menuTabs.showMenuParent ? this.resources.menuTabs : this.scene.menuTabs;
    this.editSave = true;
  }
  
  onChangeMenuTabs() {
      this.editSave = true;
      this.editMenuTabSave = true;
      this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);
  }

  setModifyTab(tab, i) {
     this.tabMenuInstance = Object.assign(tab,{'tabId':i,'isNew':false});
  }
      
  async onPasteFromClipboard() {
    try { 
      let pasteText = <HTMLInputElement> document.getElementById("output-clipboard");
      const jsonText = pasteText.value;
      
      const itemList = JSON.parse(jsonText);
      pasteText.value = '';
      let id = new Date().valueOf();
      this.bannerCopy = [];
      if( itemList.length > 0 ){
        itemList.forEach((banner)=>{        
           const newBanner = Object.assign({},banner);
           newBanner.id = id;
           newBanner.position = this.getNewPosition(banner.position);
           this.bannerCopy.push(newBanner);
           id ++;
           this.editSave = true;
           this.showInputClipboard = false;
        });
        
        //Add element into scene
        this.onPasteBannerBtn();
        
        const toast = await this.toastController.create({
          message: itemList.length > 1 ? `${itemList.length} objetos adicionados en la escena` : `1 objeto adicionado en la escena`,
          duration: 2000
        });
        toast.present();
      }
    }catch(e) {}
  }

  async onAddImgCarousel(){
    
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
        },{
         text: 'Guardar', 
         role: 'destructive', 
         handler: (data) => {
          this.editSave = true;
          this.bannerSelect.carousel.images = this.bannerSelect.carousel.images || [];
          this.bannerSelect.carousel.images.push({'url':data.url,'title':data.title});
         }
        }]
    });
    await actionAlert.present();

  }  
  
  async presentProductListCarousel() {
    
    const modal = await this.modalCtrl.create({
      component: ProductListComponent,
      swipeToClose: true, 
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 'template': this.template, 'fair': this.fair, 'pavilion': this.pavilion }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
        this.bannerSelect.carousel.images = this.bannerSelect.carousel.images || []
        this.bannerSelect.carousel.images.push({'list':data});
    }
  } 


  async onOpenChangeImg(image,list,index){
    
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
        },{
         text: 'Guardar', 
         role: 'destructive', 
         handler: (data) => {
          this.editSave = true;
          image.url = data.url;
         }
        }]
    });
    await actionAlert.present();

  }  

  
  async onDeleteCarretImg(image,list,type,index){
    
    const actionAlert = await this.alertCtrl.create({
      message: "Confirma para eliminar la "+(image.url ? "imágen":"lista de productos"),
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Eliminar', 
         role: 'destructive', 
         cssClass: 'danger',
         handler: (data) => {
          this.editSave = true;
          list[type] = list[type].filter((img,key)=>{
              return key != index;
          });
          
          this.initializeCarousels();
         }
        }]
    });
    await actionAlert.present();

  } 
  
  onClickOpenHtmlInput(obj,idType){
     if(obj[idType].isHtml) {
        this.onClickOpenHtml(obj,idType)
     }
  }
  
  onClickOpenHtml(obj,idType){
      
      this.showHtmlEditor = true;
      this.showPanelTool = null;
      this.htmlEditor = {obj: obj, idType: idType};
      
      let text ;
      if(typeof obj[idType] != 'undefined' && obj[idType] ) {
         text = '<textarea id="editorhtml">'+obj[idType]+'</textarea>';
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
  
  onCloseHtml(){
    this.showHtmlEditor = false;  
    this.showPanelTool = 'settingsBanner';
  }
  
  onAcceptHtml() {
    const iframe = <HTMLIFrameElement> document.querySelector('#editorhtml_ifr');
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
    this.editSave = true;
    this.onResizeCarousels();
  }
  
  toogleSelection() {
    this.selectionElementList = this.selectionElementList ? false : true;
    this.scene.banners.forEach((banner)=>{
        banner.isChecked = this.selectionElementList;
    });
    this.copyMultiFromList = [];
    this.scene.banners.forEach((banner)=>{
        if(banner.isChecked) {
            this.copyMultiFromList.push(banner);
        }
    });
  }

  toogleOneSelection() {
    this.copyMultiFromList = [];
    this.scene.banners.forEach((banner)=>{
        if(banner.isChecked) {
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
  
  onChangeItemTextLineHeight(event){
      

      const mili = Number.parseInt(this.bannerSelect.lineHeight);
      const unit = Number.parseFloat(this.bannerSelect.lineHeight) | 0;
      
      if( this.lineHeightMili > 9 ) {
           this.lineHeightMili = 0;
           this.lineHeightUnit ++;
      }
      else if( this.lineHeightMili < 0 ) {
           this.lineHeightMili = 9;
           this.lineHeightUnit --;
      }
      
      this.bannerSelect.lineHeight = this.lineHeightUnit + '.' + this.lineHeightMili;
  }
  
  onChangeVideoUrl() {
    //const video = document.querySelector<HTMLElement>('#video-id-'+this.bannerSelect.id);
    //video.innerHTML = '<video controls><source src="'+this.bannerSelect.video.url+'" type="video/mp4"></video>';
    this.editSave = true;
    this.bannerSelect.video.sanitizer =  this.sanitizer.bypassSecurityTrustResourceUrl(this.bannerSelect.video.url);
    
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
        text: 'Imagen',
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
}
