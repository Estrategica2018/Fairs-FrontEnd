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
import { AlertController, ModalController, IonRouterOutlet,ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
import { processData, clone } from '../../../providers/process-data';
import { TabMenuScenesComponent } from '../../map/tab-menu-scenes/tab-menu-scenes.component';
import { IonReorderGroup } from '@ionic/angular'; 
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { PopoverController, ActionSheetController  } from '@ionic/angular';
import { environment, SERVER_URL } from '../../../../environments/environment';
import { ProductListComponent } from '../../super-admin/map-editor/product-list/product-list.component';
import { SpeakersService } from '../../../api/speakers.service';
import { ProductDetailComponent } from '../../product-catalog/product-detail/product-detail.component';


@Component({
  selector: 'app-map-site-editor',
  templateUrl: './map-site-editor.page.html',
  styleUrls: ['./map-site-editor.page.scss'],
})
export class MapSiteEditorPage implements OnInit {

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
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
    private productsService: ProductsService,
    private popoverCtrl: PopoverController,
    private actionSheetController: ActionSheetController,
    private speakersService: SpeakersService) {
    
	this.initializeScene();
	this.url = window.location.origin;
	
  }
  
  
  url: string;
  scene: any = null;
  routerView: Router;
  sceneId: any;
  fair: any = null;
  pavilion: any = null;
  stand: any = null;
  product: any = null;
  template = '';
  resources : any = null;
  sceneEdited: any = null;
  editSave: boolean = false;
  showPanelTool: any;
  tabMenuOver: boolean;
  layoutMode: boolean = false;
  bannerSelectHover :any;
  success: string = null;
  editMenuTabSave: boolean;
  layoutColSel: any;
  layoutRowSel: any;
  layoutSceneSel: any;
  layoutColSelectTime = 0;
  bannerSelect = null;
  tabSelect = 'position';
  htmlEditor = {obj: null, idType: null};
  showHtmlEditor = false;
  internalUrlList: any;
  
  sceneTemplatesTypes: any = [
  {'label': 'Libre','template':'blank','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545505/temporales/blank_spui2b.png'},
  {'label': 'Bloques','template':'block','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545403/temporales/block_nq1tek.png', 'resources': '{"styles":{},"rows":[{"cols":[{"banners":[{"id":1646546787662,"styles":{"backgroundColor":"#f7f7f7","textAlign":"center","width":"100%","position":{"type":"relative"},"text":{"value":"Título de página","color":"green","fontSize":"5"},"style":{"opacity":0.55}}}]}]},{"cols":[{"banners":[{"styles":{"position":{"type":"relative"},"width":"100%","backgroundColor":"rgb(228, 238, 241)","image":{"src":"https://www.adobe.com/es/express/create/media_115f4c973bb913890cf9f7da8aa6f288f8419f1b9.jpeg?width=750&format=jpeg&optimize=medium"}},"scenes":[{"rows":[{"cols":[{"banners":[{"id":1646546787611,"styles":{"width":"100%","backgroundColor":"","position":{"type":"relative"},"image":{"src":"https://www.adobe.com/es/express/create/media_115f4c973bb913890cf9f7da8aa6f288f8419f1b9.jpeg?width=750&format=jpeg&optimize=medium"}}},{"id":1646546787634,"styles":{"backgroundColor":"","textAlign":"center","width":"100%","position":{"type":"absolute"},"text":{"value":"Hola Mundo","color":"white","fontSize":"12"}}}]}]},{"cols":[{"banners":[{"id":1646546787638,"styles":{"width":"100%","backgroundColor":"","position":{"type":"relative"},"image":{"src":"https://images.ctfassets.net/hrltx12pl8hq/qGOnNvgfJIe2MytFdIcTQ/429dd7e2cb176f93bf9b21a8f89edc77/Images.jpg"}}}]}]}]}]}]},{"banners":[{"id":1646546787643,"styles":{"width":"100%","backgroundColor":"","position":{"type":"relative"},"image":{"src":"https://m.media-amazon.com/images/I/61y8grFG24L._AC_SX466_.jpg"}}}]}]}],"show":true,"menuIcon":"map-outline","title":"Escena #3","menuTabs":{"showMenuParent":true,"position":"none"}}'},
  {'label': 'Presentación','template':'presentation','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545403/temporales/presentation_uven0s.png'},
  {'label': 'Galería','template':'gallery','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545505/temporales/gallery_wsdga2.png'},
  ];
  
    
  //statics elements list
  menuIcons = ["accessibility-outline","add-outline","add-circle-outline","airplane-outline","alarm-outline","albums-outline","alert-outline","alert-circle-outline","american-football-outline","analytics-outline","aperture-outline","apps-outline","archive-outline","arrow-back-outline","arrow-back-circle-outline","arrow-down-outline","arrow-down-circle-outline","arrow-forward-outline","arrow-forward-circle-outline","arrow-redo-outline","arrow-redo-circle-outline","arrow-undo-outline","arrow-undo-circle-outline","arrow-up-outline","arrow-up-circle-outline","at-outline","at-circle-outline","attach-outline","backspace-outline","bag-outline","bag-add-outline","bag-check-outline","bag-handle-outline","bag-remove-outline","balloon-outline","ban-outline","bandage-outline","bar-chart-outline","barbell-outline","barcode-outline","baseball-outline","basket-outline","basketball-outline","battery-charging-outline","battery-dead-outline","battery-full-outline","battery-half-outline","beaker-outline","bed-outline","beer-outline","bicycle-outline","bluetooth-outline","boat-outline","body-outline","bonfire-outline","book-outline","bookmark-outline","bookmarks-outline","bowling-ball-outline","briefcase-outline","browsers-outline","brush-outline","bug-outline","build-outline","bulb-outline","bus-outline","business-outline","cafe-outline","calculator-outline","calendar-outline","calendar-clear-outline","calendar-number-outline","call-outline","camera-outline","camera-reverse-outline","car-outline","car-sport-outline","card-outline","caret-back-outline","caret-back-circle-outline","caret-down-outline","caret-down-circle-outline","caret-forward-outline","caret-forward-circle-outline","caret-up-outline","caret-up-circle-outline","cart-outline","cash-outline","cellular-outline","chatbox-outline","chatbox-ellipses-outline","chatbubble-outline","chatbubble-ellipses-outline","chatbubbles-outline","checkbox-outline","checkmark-outline","checkmark-circle-outline","checkmark-done-outline","checkmark-done-circle-outline","chevron-back-outline","chevron-back-circle-outline","chevron-down-outline","chevron-down-circle-outline","chevron-forward-outline","chevron-forward-circle-outline","chevron-up-outline","chevron-up-circle-outline","clipboard-outline","close-outline","close-circle-outline","cloud-outline","cloud-circle-outline","cloud-done-outline","cloud-download-outline","cloud-offline-outline","cloud-upload-outline","cloudy-outline","cloudy-night-outline","code-outline","code-download-outline","code-slash-outline","code-working-outline","cog-outline","color-fill-outline","color-filter-outline","color-palette-outline","color-wand-outline","compass-outline","construct-outline","contract-outline","contrast-outline","copy-outline","create-outline","crop-outline","cube-outline","cut-outline","desktop-outline","diamond-outline","dice-outline","disc-outline","document-outline","document-attach-outline","document-lock-outline","document-text-outline","documents-outline","download-outline","duplicate-outline","ear-outline","earth-outline","easel-outline","egg-outline","ellipse-outline","ellipsis-horizontal-outline","ellipsis-horizontal-circle-outline","ellipsis-vertical-outline","ellipsis-vertical-circle-outline","enter-outline","exit-outline","expand-outline","extension-puzzle-outline","eye-outline","eye-off-outline","eyedrop-outline","fast-food-outline","female-outline","file-tray-outline","file-tray-full-outline","file-tray-stacked-outline","film-outline","filter-outline","filter-circle-outline","finger-print-outline","fish-outline","fitness-outline","flag-outline","flame-outline","flash-outline","flash-off-outline","flashlight-outline","flask-outline","flower-outline","folder-outline","folder-open-outline","football-outline","footsteps-outline","funnel-outline","game-controller-outline","gift-outline","git-branch-outline","git-commit-outline","git-compare-outline","git-merge-outline","git-network-outline","git-pull-request-outline","glasses-outline","globe-outline","golf-outline","grid-outline","hammer-outline","hand-left-outline","hand-right-outline","happy-outline","hardware-chip-outline","headset-outline","heart-outline","heart-circle-outline","heart-dislike-outline","heart-dislike-circle-outline","heart-half-outline","help-outline","help-buoy-outline","help-circle-outline","home-outline","hourglass-outline","ice-cream-outline","id-card-outline","image-outline","images-outline","infinite-outline","information-outline","information-circle-outline","invert-mode-outline","journal-outline","key-outline","keypad-outline","language-outline","laptop-outline","layers-outline","leaf-outline","library-outline","link-outline","list-outline","list-circle-outline","locate-outline","location-outline","lock-closed-outline","lock-open-outline","log-in-outline","log-out-outline","magnet-outline","mail-outline","mail-open-outline","mail-unread-outline","male-outline","male-female-outline","man-outline","map-outline","medal-outline","medical-outline","medkit-outline","megaphone-outline","menu-outline","mic-outline","mic-circle-outline","mic-off-outline","mic-off-circle-outline","moon-outline","move-outline","musical-note-outline","musical-notes-outline","navigate-outline","navigate-circle-outline","newspaper-outline","notifications-outline","notifications-circle-outline","notifications-off-outline","notifications-off-circle-outline","nuclear-outline","nutrition-outline","open-outline","options-outline","paper-plane-outline","partly-sunny-outline","pause-outline","pause-circle-outline","paw-outline","pencil-outline","people-outline","people-circle-outline","person-outline","person-add-outline","person-circle-outline","person-remove-outline","phone-landscape-outline","phone-portrait-outline","pie-chart-outline","pin-outline","pint-outline","pizza-outline","planet-outline","play-outline","play-back-outline","play-back-circle-outline","play-circle-outline","play-forward-outline","play-forward-circle-outline","play-skip-back-outline","play-skip-back-circle-outline","play-skip-forward-outline","play-skip-forward-circle-outline","podium-outline","power-outline","pricetag-outline","pricetags-outline","print-outline","prism-outline","pulse-outline","push-outline","qr-code-outline","radio-outline","radio-button-off-outline","radio-button-on-outline","rainy-outline","reader-outline","receipt-outline","recording-outline","refresh-outline","refresh-circle-outline","reload-outline","reload-circle-outline","remove-outline","remove-circle-outline","reorder-four-outline","reorder-three-outline","reorder-two-outline","repeat-outline","resize-outline","restaurant-outline","return-down-back-outline","return-down-forward-outline","return-up-back-outline","return-up-forward-outline","ribbon-outline","rocket-outline","rose-outline","sad-outline","save-outline","scale-outline","scan-outline","scan-circle-outline","school-outline","search-outline","search-circle-outline","send-outline","server-outline","settings-outline","shapes-outline","share-outline","share-social-outline","shield-outline","shield-checkmark-outline","shield-half-outline","shirt-outline","shuffle-outline","skull-outline","snow-outline","sparkles-outline","speedometer-outline","square-outline","star-outline","star-half-outline","stats-chart-outline","stop-outline","stop-circle-outline","stopwatch-outline","storefront-outline","subway-outline","sunny-outline","swap-horizontal-outline","swap-vertical-outline","sync-outline","sync-circle-outline","tablet-landscape-outline","tablet-portrait-outline","telescope-outline","tennisball-outline","terminal-outline","text-outline","thermometer-outline","thumbs-down-outline","thumbs-up-outline","thunderstorm-outline","ticket-outline","time-outline","timer-outline","today-outline","toggle-outline","trail-sign-outline","train-outline","transgender-outline","trash-outline","trash-bin-outline","trending-down-outline","trending-up-outline","triangle-outline","trophy-outline","tv-outline","umbrella-outline","unlink-outline","videocam-outline","videocam-off-outline","volume-high-outline","volume-low-outline","volume-medium-outline","volume-mute-outline","volume-off-outline","walk-outline","wallet-outline","warning-outline","watch-outline","water-outline","wifi-outline","wine-outline","woman-outline","logo-alipay","logo-amazon","logo-amplify","logo-android","logo-angular","logo-apple","logo-apple-appstore","logo-apple-ar","logo-behance","logo-bitbucket","logo-bitcoin","logo-buffer","logo-capacitor","logo-chrome","logo-closed-captioning","logo-codepen","logo-css3","logo-designernews","logo-deviantart","logo-discord","logo-docker","logo-dribbble","logo-dropbox","logo-edge","logo-electron","logo-euro","logo-facebook","logo-figma","logo-firebase","logo-firefox","logo-flickr","logo-foursquare","logo-github","logo-gitlab","logo-google","logo-google-playstore","logo-hackernews","logo-html5","logo-instagram","logo-ionic","logo-ionitron","logo-javascript","logo-laravel","logo-linkedin","logo-markdown","logo-mastodon","logo-medium","logo-microsoft","logo-no-smoking","logo-nodejs","logo-npm","logo-octocat","logo-paypal","logo-pinterest","logo-playstation","logo-pwa","logo-python","logo-react","logo-reddit","logo-rss","logo-sass","logo-skype","logo-slack","logo-snapchat","logo-soundcloud","logo-stackoverflow","logo-steam","logo-stencil","logo-tableau","logo-tiktok","logo-tumblr","logo-tux","logo-twitch","logo-twitter","logo-usd","logo-venmo","logo-vercel","logo-vimeo","logo-vk","logo-vue","logo-web-component","logo-wechat","logo-whatsapp","logo-windows","logo-wordpress","logo-xbox","logo-xing","logo-yahoo","logo-yen"];
  
  errors: String = null;
  sucess: String = null;
  
  ngOnInit() {
	 //this.scene = this._defaultScene();
	 this.routerView = this.router;
	 this.sceneTemplatesTypes = processData(this.sceneTemplatesTypes);
  }
  
  initializeScene() {
     
     this.loading.present({message:'Cargando...'});
	 
     const url = window.location.href;
     this.template = url.indexOf('super-admin/map-site-editor/fair')  >= 0 ? 'fair' : 
     url.indexOf('super-admin/map-site-editor/pavilion')  >= 0 ? 'pavilion' :
     url.indexOf('super-admin/map-site-editor/stand')  >= 0 ? 'stand' : 
     url.indexOf('super-admin/map-site-editor/product')  >= 0 ? 'product' : 
     '';
     
     const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
     const standId = this.route.snapshot.paramMap.get('standId');
     const productId = this.route.snapshot.paramMap.get('productId');
     this.sceneId = this.route.snapshot.paramMap.get('sceneId');
     
     
     this.fairsService.getCurrentFair().then((fair)=>{
        
        this.fair = fair;

        if(this.template === 'fair') {
          this.resources = fair.resources;
          
		  if(this.sceneId) {
		    this.scene = fair.resources.scenes[this.sceneId];
		  }
		  else {
		    const sceneTemplateId = this.route.snapshot.paramMap.get('template');
		    for(let templ of this.sceneTemplatesTypes) {
  			  if(templ.template ===  sceneTemplateId  ) {

				templ.resources.rows.forEach((row)=>{
				  row.id = this._getId();
				  row.cols.forEach((col)=>{
					 col.id = this._getId();
					 col.banners.forEach((banner)=>{
					   col.id = this._getId();
					 });
				  });
				});
  
  			    this.scene = templ.resources;
			    break;
			  }
		    }
		  }
		}
        else if(this.template === 'pavilion') {
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId) {
                this.pavilion = pavilion;
				this.resources = this.pavilion.resources;
                this.scene = this.sceneId ? this.pavilion.resources.scenes[this.sceneId] : this._defaultScene();
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
                      this.scene = this.sceneId ? this.stand.resources.scenes[this.sceneId] : this._defaultScene();
                   }
                });
              }
          });
        }
       
	    this.sceneEdited = this.scene;
		this.loading.dismiss();
		
     }, error => {
        this.loading.dismiss();
        this.errors = `Consultando el servicio del mapa general de la feria ${error}`;
     });
        
  }

  _defaultScene(){
	  return { 'styles': {}, 'rows':[{ 'cols':[{ 'scenes': [] }]}],
               'show': true,
               'menuIcon': 'map-outline', 
               'title': 'Escena #' + (this.resources.scenes.length + 1),
               'menuTabs': {'showMenuParent':true, 'position':'none' }
	  };
  }

  dragBannerEnd($event,scene) {
     
  }

  //windowScreenSm : boolean = window.innerWidth  <= 992;
  windowScreenSm : boolean = window.innerWidth  <= 798;
  windowScreenLg : boolean = window.innerWidth  <= 19798;
  
  @HostListener('window:resize', ['$event'])
  onResize() {
	  this.windowScreenSm = window.innerWidth  <= 992;
  }
  
  onHoverBanner($event) {
	  const banner = $event.banner;
	  if(this.bannerSelectHover && banner && this.bannerSelectHover.id !== banner.id) {
	    //this.sceneEdited = $event.scene;
	  }
	  this.bannerSelectHover = banner;
  }
  
  _getId() {
    return new Date().valueOf() + Math.floor(Math.random() * (100 + 1));
  }

  onChangeItem($event){
	this.editSave = true
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
      
      /*if(this.editMenuTabSave && this.scene.menuTabs.showMenuParent) {
          this.resources.menuTabs = this.tabMenuObj;
      }*/
      
      if(this.template === 'fair') {
          this.fair.resources = this.resources;
          this.adminFairsService.updateFair(this.fair)
          .then((response) => {
              this.loading.dismiss();
              this.success = `Escena modificada correctamente`;
			  this.presentToast(this.success);
              this.fairsService.refreshCurrentFair();
              this.editSave = false;
              this.errors = null;
              if(!this.sceneId) {
                  this.resources = processData(response.data_fair.resources);
                  this.sceneId = this.resources.scenes.length - 1;
                  this.editMenuTabSave = null;
                  this.showPanelTool = false
                  this.redirectTo('/super-admin/map-site-editor/fair/'+this.sceneId);
                  //window.location.replace(`${this.url}/Fair-website/#/super-admin/map-site-editor/fair/${this.sceneId}`);
              }
           })
           .catch(error => {
               this.loading.dismiss();
               this.errors = `Consultando el servicio para actualizar feria ${error}`;
			   this.success = null;
			   this.presentToast(this.errors);
           });
      }
      else if(this.template === 'pavilion') {
          this.pavilion.resources = this.resources;
          this.adminPavilionsService.update(this.pavilion)
          .then((pavilion) => {
              this.loading.dismiss();
			  this.success = `Escena modificada correctamente`;
			  this.presentToast(this.success);
              this.errors = null;
              if(!this.sceneId) {
                  this.resources = processData(pavilion.resources);
                  this.sceneId = this.resources.scenes.length - 1;
              }
              this.fairsService.refreshCurrentFair();
              this.pavilionsService.refreshCurrentPavilion();
              this.editMenuTabSave = null;
              this.editSave = false;
              this.showPanelTool = false
              //window.location.replace(`${this.url}/Fair-website/#/super-admin/map-site-editor/pavilion/${this.pavilion.id}/${this.sceneId}`);
              //this.router.navigateByUrl(`/super-admin/map-site-editor/pavilion/${this.pavilion.id}/${this.sceneId}`);
              this.redirectTo('/super-admin/map-site-editor/pavilion/' + this.pavilion.id + '/' + this.sceneId);
           })
           .catch(error => {
               this.loading.dismiss();
               this.errors = `Consultando el servicio para actualizar pabellón ${error}`;
			   this.success = null;
			   this.presentToast(this.errors);
           });
      }
      else if(this.template === 'stand') {
          this.stand.resources = this.resources;
          this.adminStandsService.update(this.stand)
          .then((stand) => {
              this.loading.dismiss();
			  this.success = `Escena modificada correctamente`;
			  this.presentToast(this.success);
              if(!this.sceneId) {
                  this.sceneId = this.resources.scenes.length - 1;
              }
              this.fairsService.refreshCurrentFair();
              this.pavilionsService.refreshCurrentPavilion();
              this.errors = null;
              this.editMenuTabSave = null;
              this.editSave = false;
              this.showPanelTool = false
              this.redirectTo('/super-admin/map-site-editor/stand/' + this.pavilion.id + '/' + this.stand.id + '/' + this.sceneId);
              //window.location.replace(`${this.url}/Fair-website/#/super-admin/map-site-editor/stand/${this.pavilion.id}/${this.stand.id}/${this.sceneId}`);
              //this.router.navigateByUrl(`/super-admin/map-site-editor/stand/${this.pavilion.id}/${this.stand.id}/${this.sceneId}`);
           })
           .catch(error => {
               this.loading.dismiss(); 
			   this.errors = `Consultando el servicio para actualizar local comercial ${error}`;
			   this.success = null;
			   this.presentToast(this.errors);
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
              this.editSave = false;
              this.showPanelTool = false
              //window.location.replace(`${this.url}/Fair-website/#/super-admin/map-site-editor/product/${this.pavilion.id}/${this.stand.id}/${this.product.id}/${this.sceneId}`);
              this.redirectTo('/super-admin/map-site-editor/product/' + this.pavilion.id + '/' + this.stand.id + '/' + this.product.id + '/' + this.sceneId);
              //this.router.navigateByUrl(`/super-admin/map-site-editor/product/${this.pavilion.id}/${this.stand.id}/${this.product.id}/${this.sceneId}`);
           })
           .catch(error => {
               this.loading.dismiss(); 
               this.errors = `Consultando el servicio para actualizar producto ${error}`;
           });
      }
  }  
  
  onSelectPanel(tabname) {
     if(this.showPanelTool == tabname) {
        this.showPanelTool = null;
     }
     else {
        this.showPanelTool = tabname; 
     }
  }

  async presentToast(message) {
    let toast =  await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }
  
  addBanner(type) {
    const id = new Date().valueOf();
    const primaryColor = "#007bff";
    let banner: any;
    const _defaultBanner = {
		"id":id,
		"type":type,
	    //"position": this.getNewPosition({"x":156,"y":195}),
	    "styles": {
		   "position":{"type":"relative"},"rotation":{"x":0,"y":0,"z":0},"border":{"style":"none"},
	       "fontWeight":100,"textAlign":"center","width":"100%","fontFamily":'YoutubeSansMedium', 
	       "fontSize": 12,"lineHeight":"1.0","lineHeightUnit":1,"lineHeightMili":"0",
		   "shadowActivate":false,"shadowRight":4,"shadowDown":4,"shadowDisperse":7,"shadowExpand":2,"shadowColor":"#ababab"
	  }
	};
    switch(type) { 
      case 'Text':
          banner = {styles:{"textAlign":"left","fontColor":"#000000","text":{"value":"Texto aquí"}}};
      break;
      case 'Image':
          banner = {styles: {"image": { src: "https://dummyimage.com/114x105/EFEFEF/000.png"}}};
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
      case 'Título':
          banner = {
			  "styles":{
		        "backgroundColor":"#f7f7f7",
				"textAlign":"center","fontColor":"#98A000",
				"fontSize": 59, 
			    "text": {"fontSize": 5,"value":"Título de la Escena aquí","color":"#98A000"}
				
		      },
			  "position": this.getNewPosition({"x":156,"y":95})};
      break;
      case 'Sub-Título':
          banner = {styles: {"color": "#98A000"}};
      break;
      case 'SpeakerCatalog':
          banner = { "size":{"x":428,"y":237},
            "position": this.getNewPosition({"x":64,"y":29}),
            "speakerCatalog":{"nameFontSize":24,"nameFontColor":"#ffffff","nameTop":26,"nameLeft":225,"nameFontFamily":"YoutubeSansMedium","nameFontWeight":"100",
            "descHeigth": 69,
            "descTop":139,"descLeft":198,"descWidth":208,"descFontSize":14,"descTextAlign":"justify","lineHeightMili":0,"lineHeightUnit":1,"lineHeight":1,"descFontFamily":"YoutubeSansLight","descFontWeight":100,"titleFontColor":"#000","titleFontFamily":"YoutubeSansMedium","titleFontSize":19,"titleFontWeight":"bold","titleLeft":0,"titleTop":113,"imagesTop":0,"imagesLeft":0,"imagesWidth":187,"imagesHeight":224,"imagesPriceWidth":16,"imagestitleWidth":null,"priceTop":38,"priceLeft":27,"priceFontColor":"#ff1a1a","nameWidth":177,"nameHeight":0,"logoLeft":142,"logoTop":26,"logoWidth":74,"logoHeight":69,"professionFontColor":"#ffffff","professionTop":97,"professionLeft":199,"descFontColor":"","professionFontSize":15},"backgroundColor":"#109be0",
            "class":"rounded-withradius grayscale cursor-pointer","fontColor":"#ffffff"};
          banner.border = { "radius": 19, "style": "solid", "color": "rgba(0,0,0,.125)" };
      break;
      case 'ProductCatalog': 
          banner = { "size":{"x":428,"y":237},
          "position": this.getNewPosition({"x":64,"y":29}),
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
          },'backgroundColor':'#f5f6ff'};
          banner.border = { "radius": 19, "style": "solid", "color": "rgba(0,0,0,.125)" };
          
      break;
      case 'Contact':
          banner = {"groupMode":true,"size":{"x":367,"y":408},"contact": { "name":"" }, "backgroundColor":"#ffffff","fontColor":"#000000", "fontSize":"13", "shadowActivate":true,"shadowRight":-8,"shadowDown":4,"shadowDisperse":21,"shadowExpand":-16};
      break;
      case 'ProductName':
          banner = {"size":{"x":300,"y":33},"position": this.getNewPosition({"x":532,"y":41}),"fontColor":"#F5F6FF","fontSize":"25"};
      break;
      case 'ProductDescription':
          banner = {"size":{"x":530,"y":205},"position": this.getNewPosition({"x":359,"y":115}),"textAlign":"justify","fontColor":"#000","fontSize":"16"};
      break;      
      case 'ProductCarousel':
          banner = {"size":{"x":304,"y":291},"position": this.getNewPosition({"x":117,"y":141})};
      break;
      case 'Banner':
          banner = {"fontColor":"#000000","backgroundColor":"#ffff00","size":{"x":114,"y":105},
                    "border":{"style":"solid","color":"#000","radius":20,"width":1}};
      break;
    }
    
	const newBanner = Object.assign(_defaultBanner,banner);
	console.log(newBanner);
    this.layoutColSel.banners.push(newBanner);
    //open settingsBanner panel with last element
    this.bannerSelect = this.layoutColSel.banners[this.layoutColSel.banners.length-1];
    //if(this.bannerSelect.productCatalog) this.presentNewProductListCatalog(this.bannerSelect);
    //if(this.bannerSelect.speakerCatalog) this.initializeSpeakers(this.bannerSelect);
    this.onChangeItem(null);
    this.showPanelTool = 'settingsBanner'; 
  }

  getNewPosition(pos) {
      this.layoutColSel.banners.forEach((banner)=>{
          if(banner.position && banner.position.x == pos.x && banner.position.y == pos.y) {
              pos = this.getNewPosition({"x":pos.x + 10,"y":pos.y + 10});
          }
      });
      return pos;
  }

  
  layoutColSelect($event){
	  if($event && $event.layoutColSel && (Date.now() - this.layoutColSelectTime) > 100 ) {
	    this.layoutColSel = $event.layoutColSel;
	    this.layoutRowSel = $event.layoutRowSel;
	    this.layoutSceneSel = $event.layoutSceneSel;
		this.showPanelTool = 'settingsLayout';
		this.layoutColSelectTime = Date.now();
	  }
  } 

  onDeleteBanner(bannerSelect) {
	  
	let colTmp = this.getLayout(bannerSelect, this.scene);
	
	if(colTmp && colTmp.banners) {
	  this.layoutColSel = colTmp;
	  this.layoutColSel.banners = this.layoutColSel.banners.filter((banner)=>{
        return bannerSelect != banner; 
      });
      this.bannerSelect = null;
      this.showPanelTool = false;
      this.onChangeItem(null);
	}
  }
  
  onDeleteColumn() {
	this.layoutRowSel.cols = this.layoutRowSel.cols.filter((col)=>{
       return col != this.layoutColSel;
	});
	
	if(this.layoutRowSel.cols.length == 0) {
		this.layoutSceneSel.rows = this.layoutSceneSel.rows.filter((row)=>{
			return row != this.layoutRowSel;
		});
	}
	
	this.showPanelTool = '';
	this.layoutColSel = null;
	this.layoutRowSel = null;
  }
  
  getLayout(banner,scene) {
	for(let row of scene.rows ) {
	  for(let col of row.cols ) {
	    for(let bannerCol of col.banners ) {
          if(bannerCol.id === banner.id) {
              return col;
          }
		  else if(bannerCol.scenes){
			  for(let sceneSubCol of bannerCol.scenes) {
				  
				  let layoutSubCol = this.getLayout(banner,sceneSubCol);
				  if(layoutSubCol){ 
				     return bannerCol;
				  }
				  
			  }
		  }
		}
	  }
	}
	return 	null;
  }
  
  onAddRowToColumn() {
	  console.log(this.layoutColSel);
  }

  onChangeBackgroundStyle() {
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
                  this.adminFairsService.updateFair(this.fair)
                   .then((response) => {
                       this.loading.dismiss(); 
                       this.fairsService.refreshCurrentFair();
					   const detail = {'type': 'sceneFair', 'iScene': sceneId };
                       window.dispatchEvent(new CustomEvent('removeScene:menu',{ detail: detail }));
					   //window.location.replace(`${this.url}/Fair-website/#/super-admin/fair`);
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
                       window.location.replace(`${this.url}/Fair-website/#/super-admin/pavilion/${this.pavilion.id}`);
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
                       window.location.replace(`${this.url}/Fair-website/#/super-admin/stand/${this.pavilion.id}/${this.stand.id}`);
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
  
  initializeHtmlTexts(banners) {
      banners.forEach((banner)=>{
          banner.textHtml = this.sanitizer.bypassSecurityTrustHtml(banner.text);
      });
  }  
  
  initializeInternalUrl() {
    this.internalUrlList = {'fair':[],'pavilions':[],'stands':[]};
    let scene, pavilion, stand;
    for(let i=0; i<this.fair.resources.scenes.length; i++) {
        scene = this.fair.resources.scenes[i];
        this.internalUrlList.fair.push({'label':'Escena - ' + (i+1) + ': ' + scene.title, 'value':`/map/fair/${i}`});
    }
    for(let i=0; i<this.fair.pavilions.length; i++) {
        pavilion = this.fair.pavilions[i];
        for(let j=0; j<pavilion.resources.scenes.length; j++) {
            scene = pavilion.resources.scenes[j];
            this.internalUrlList.pavilions.push({'label':'Pabellón '+ pavilion.name + '. Escena - ' + (j+1), 'value':`/map/pavilion/${pavilion.id}/${j}`});
        }
        for(let j=0; j<pavilion.stands.length; j++) {
            stand = pavilion.stands[j];
            for(let k=0; k<stand.resources.scenes.length; k++) {
                scene = stand.resources.scenes[k];
                this.internalUrlList.stands.push({'label':'Local '+ stand.merchant.name + '. Escena - ' + (k+1), 'value':`/map/stand/${pavilion.id}/${stand.id}/${k}`});
            }
        }
    }
  }
  
  addArrowLineCurve(){}
}
