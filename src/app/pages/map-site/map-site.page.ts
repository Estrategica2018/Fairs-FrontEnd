import { Component, ElementRef, QueryList, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../api/fairs.service';
import { PavilionsService } from './../../api/pavilions.service';
import { ProductsService } from './../../api/products.service';
import { SpeakersService } from '../../api/speakers.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { AlertController, ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
//import { processData, clone } from '../../providers/process-data';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { UsersService } from 'src/app/api/users.service';
import { environment,SERVER_URL } from 'src/environments/environment';
import { AgendasService } from 'src/app/api/agendas.service';

@Component({
  selector: 'app-map-site',
  templateUrl: './map-site.page.html',
  styleUrls: ['./map-site.page.scss'],
})
export class MapSitePage implements OnInit {


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
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
    private productsService: ProductsService,
    private popoverCtrl: PopoverController,
    private actionSheetController: ActionSheetController,
    private speakersService: SpeakersService,
    private usersService: UsersService,
    private agendasService: AgendasService,) {

    this.initializeScene();
    this.initializeListeners();
    this.url = window.location.origin;
  }

  url: string;
  scene: any = {};
  routerView: Router;
  sceneId: any;
  fair: any = null;
  pavilion: any = null;
  stand: any = null;
  product: any = null;
  template = '';
  resources: any = null;
  sceneEdited: any = null;
  editMode: boolean = true;
  editSave: boolean = false;
  showPanelTool: any;
  tabMenuOver: boolean;
  layoutModel: boolean = false;
  bannerSelectHover: any;
  success: string = null;
  editMenuTabSave: boolean;
  layoutColSel: any;
  layoutRowSel: any;
  layoutSceneSel: any;
  layoutColSelectTime = 0;
  bannerSelect = null;
  tabSelect = 'position';
  htmlEditor = { obj: null, idType: null };
  showHtmlEditor = false;
  internalUrlList: any;
  showInputClipboard = false;
  bannerCopy = [];
  copyMultiFromList = [];
  themeSelected = null;
  layoutColHover = null;
  errors: String = null;
  profileRole: any;
  userDataSession: any;
  mobileApp: boolean = false;
  bannersFloat: any = [];
  toolBarSize = 0;
  
  ngOnInit() {
    
    this.routerView = this.router;
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      this.mobileApp = true;
    }
  }

  ngDoCheck() {
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  ngOnDestroy(): void {

  }

  initializeScene() {

    this.loading.present({ message: 'Cargando...' });

    const url = window.location.href;
    this.template = url.indexOf('map-site/fair') >= 0 ? 'fair' :
      url.indexOf('map-site/pavilion') >= 0 ? 'pavilion' :
        url.indexOf('map-site/stand') >= 0 ? 'stand' :
          url.indexOf('map-site/product') >= 0 ? 'product' :
            '';

    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    this.sceneId = this.route.snapshot.paramMap.get('sceneId');
    //this.productId = this.route.snapshot.paramMap.get('productId');
    const sceneTemplateId = this.route.snapshot.paramMap.get('template');
    

    this.fairsService.getCurrentFair().then((fair) => {

      this.fair = fair;

      this.usersService.getUser().then((userDataSession: any) => {
        this.userDataSession = userDataSession;

        this.profileRole = {};
        if (userDataSession && userDataSession.user_roles_fair) {
          userDataSession.user_roles_fair.forEach((role) => {
            if (role.id == 1) { //"super_administrador"
              this.profileRole.admin = true;
            }
          });
        }

      });

      if (this.template === 'fair') {
        this.resources = this.fair.resources;
        this.scene = this.fair.resources.scenes[this.sceneId];
      }
      else if (this.template === 'pavilion') {
        this.fair.pavilions.forEach((pavilion) => {
          if (pavilion.id == pavilionId) {
            this.pavilion = pavilion;
            this.resources = this.pavilion.resources;
            this.scene = this.pavilion.resources.scenes[this.sceneId];
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
                this.scene = this.stand.resources.scenes[this.sceneId];
              }
            });
          }
        });
      }

      this.sceneEdited = this.scene;
      if (this.scene) {
        this.initializeBanners(this.scene);
        

        setTimeout(() => {
          this.onResize();
          this.loading.dismiss();
        }, 100);
      }
      else {
        this.redirectTo(environment.redirectTo);
      }

    }, error => {
      this.loading.dismiss();
      this.errors = `Consultando el servicio del mapa general de la feria ${error}`;
    });

  }

  initializeBanners(scene: any) {

    scene.row = scene.row || [];
    for (let row of scene.rows) {
      for (let col of row.cols) {
        for (let banner of col.banners) {
          if (banner.floatButton || (banner.styles && banner.styles.position.type == 'float')) {
            this.bannersFloat.push(banner);
          }
        }
      }
    }

    if (scene && scene.videoPreview)
      scene.videoPreviewSanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(scene.videoPreview);


    let rows = scene.rows;
    rows.forEach((row) => {
      row.cols.forEach((col) => {
        col.banners.forEach((banner) => {

          if (banner.video) {
            banner.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(banner.video.url);
          }

          if(banner.iFrame) {
            setTimeout(() => {
              const iframe = document.getElementById(banner.id);
              const src = banner.iFrame.src.replace('<iframe ','<iframe class="h-100" id="'+banner.id+'" ');
              //
              iframe.outerHTML = banner.iFrame.src;
              iframe.classList.add("h-100");
              
            }, 200);
          }

          if (banner.scenes) {
            banner.scenes.forEach((sceneChild) => {
              this.initializeBanners(sceneChild);
            });
          }
        });
      });
    });
  }

  setIdForRow(rows) {
    rows.forEach((row) => {
      row.id = this._getId();
      row.cols.forEach((col) => {
        col.id = this._getId();
        col.banners.forEach((banner) => {
          col.id = this._getId();
          if (banner.scenes)
            banner.scenes.forEach((scene) => {
              this.setIdForRow(scene.rows);
            });
        });
      });
    });
  }
  windowScreenSm: boolean = window.innerWidth <= 858;
  windowScreenLg: boolean = window.innerWidth <= 19798;

  @HostListener('window:resize')
  onResizeAdjustSize() {
    this.onResize();
    setTimeout(() => { this.onResize(); }, 100);
  }

  onResize() {

    this.toolBarSize = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
    this.windowScreenSm = window.innerWidth <= 858;

    this.scene.rows.forEach((row) => {
      row.cols.forEach((col) => {
        col.banners.forEach((banner) => {
          if (banner.triangle) {
            const ionContent = document.querySelector<HTMLElement>('#col-' + col.id);
            ionContent.setAttribute("data-with", ionContent.offsetWidth + '');
            if (ionContent.offsetWidth > 0) {
              if (banner.triangle) {
                let height = (banner.styles.height ? banner.styles.height : '100');
                height += banner.styles.heightUnit ? banner.styles.heightUnit : 'px';

                banner.triangle.borderWidth = ionContent.offsetWidth / 2;
                banner.triangle.triangleBorderHeight = ionContent.offsetHeight;
                banner.triangle.triangleBorderHeightUnit = 'px';
              }
            }
          }

          if (banner.externalUrl) {
            if (this.mobileApp) {
              banner.externalUrl = banner.externalUrl.replace("web.whatsapp", "api.whatsapp");
            }
          }

        });
      });
    });
  }


  _getId() {
    return new Date().valueOf() + Math.floor(Math.random() * (1000 + 1));
  }

  onChangeItem() {
    this.editSave = true;
    window.dispatchEvent(new CustomEvent('side-menu-button:edit-save-on'));
  }

  onChangeItemOff() {
    this.editSave = true;
    window.dispatchEvent(new CustomEvent('side-menu-button:edit-save-off'));
  }

  async presentToast(message) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  layoutColSelect($event) {
    if ($event && $event.layoutColSel && (Date.now() - this.layoutColSelectTime) > 100) {
      this.layoutColSel = $event.layoutColSel;
      this.layoutRowSel = $event.layoutRowSel;
      this.layoutSceneSel = $event.layoutSceneSel;
      this.layoutColSelectTime = Date.now();
    }
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

  addArrowLineCurve() { }

  initializeListeners() {

    window.addEventListener('window:resize-menu', () => {
      setTimeout(() => { this.onResize(); }, 100);
    });
  }

  onToBackEditor(scene) {
    window.history.back();
  }

  onToMapEditor(scene) {
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    const sceneId = this.route.snapshot.paramMap.get('sceneId');

    if (this.template === 'fair') {
      this.redirectTo(`/super-admin/map-site-editor/fair/${sceneId}`);
    }
    else if (this.template === 'pavilion') {
      this.redirectTo(`/super-admin/map-site-editor/pavilion/${pavilionId}/${sceneId}`);
    }
    else if (this.template === 'stand') {
      this.redirectTo(`/super-admin/map-site-editor/stand/${pavilionId}/${standId}/${sceneId}`);
    }
  }

  goToOnHoverBanner(banner) {

    
    if (banner.formCatalog) {
      this.redirectTo('/form-mincultura-catalog');
    }
    else if (banner.speakerCatalog) {
      
    }
    else if (banner && banner.externalUrl) {
      const windowReference = window.open();
      windowReference.location.href = banner.externalUrl;
    } else if (banner.internalUrl) {
      this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
        this.router.navigate([banner.internalUrl])
      });
    }
  }

}