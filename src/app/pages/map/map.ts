import { Component, ElementRef, QueryList, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../api/fairs.service';
import { StandsService } from './../../api/stands.service';
import { ProductsService } from './../../api/products.service';
import { AgendasService } from './../../api/agendas.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { Animation, AnimationController } from '@ionic/angular';
import { TabMenuScenesComponent } from '../map/tab-menu-scenes/tab-menu-scenes.component';
import { ProductDetailComponent } from '../product-catalog/product-detail/product-detail.component';
import { FormCatalogComponent } from './form-catalog/form-catalog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersService } from '../../api/users.service';
import { ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SpeakerDetailComponent } from '../speaker-list/speaker-detail/speaker-detail.component';
import { SpeakersService } from '../../api/speakers.service';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart-component/shopping-cart-component';
import { LoginComponent } from '../login/login.component';
import { environment, SERVER_URL } from '../../../environments/environment';
import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements OnInit {

  url = SERVER_URL;
  number = Number;
  @ViewChild('menuTabs', { static: true }) menuTabs: TabMenuScenesComponent;
  @ViewChildren('carousels') carousels: any;
  @ViewChildren('carouselSlides') carouselSlides: any;
  //@ViewChildren('productCatalog') productCatalogs: any;
  fullScreen = false;
  scene: any;
  intro = false;
  errors = null;
  fair = null;
  pavilion = null;
  stand = null;
  moveMouseEvent: any;
  isHover = null;
  tabMenuObj: any;
  resources = null;
  template = null;
  bannerSelectHover = null;
  bannerSpeakerSelectHover = null;
  userDataSession = null;
  speakerList = [];

  profileRole: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  modalSpeaker: any;
  offsetHeight: 0;
  sceneId: any = '0';
  modal: any;

  toolBarSize = 0;

  constructor(
    private standService: StandsService,
    private fairsService: FairsService,
    private productsService: ProductsService,
    private agendasService: AgendasService,
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController,
    private loading: LoadingService,
    private sanitizer: DomSanitizer,
    private usersService: UsersService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private speakersService: SpeakersService,
    private popoverCtrl: PopoverController,
    private actionSheetController: ActionSheetController,
    private datepipe: DatePipe) {

    this.listenForFullScreenEvents();
    this.initializeListeners();
    this.usersService.getUser().then((userDataSession: any) => {

      this.userDataSession = userDataSession;

      if (userDataSession && userDataSession.user_roles_fair) {
        this.profileRole = {};
        userDataSession.user_roles_fair.forEach((role) => {
          if (role.id == 1) { //"super_administrador"
            this.profileRole.admin = true;
          }
        });

      }
    });
  }

  ngOnInit() {
    const div = document.querySelector<HTMLElement>('.div-container');
    //div.addEventListener('scroll', this.logScrolling);
    this.initializeScreen();
  }

  ngOnDestroy(): void {
    if (window.location.href.indexOf('map') < 0) {
      window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    }
    if (this.modal) { this.modal.dismiss(); }
  }

  ngAfterViewInit() {
    //this.initializeScreen();
  }

  ngDoCheck() {
    const main = document.querySelector<HTMLElement>('ion-router-outlet');
    const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
    main.style.top = top + 'px';
    const div = document.querySelector<HTMLElement>('.div-container');
    div.style.height = (window.innerHeight - top) + 'px';
  }

  initializeScreen() {
    this.errors = null;
    this.loading.present({ message: 'Cargando...' });
    this.sceneId = this.route.snapshot.paramMap.get('sceneId');

    this.fairsService.getCurrentFair().then((fair) => {
      this.fair = fair;


      if (!this.fair.resources) {
        this.loading.dismiss();
        return;
      }
      if (this.router.url.indexOf('/fair') >= 0) {
        this.template = 'fair';
        this.scene = fair.resources.scenes[this.sceneId];
        this.resources = fair.resources;
      }
      else if (this.router.url.indexOf('/pavilion') >= 0) {
        this.template = 'pavilion';
        const pavilionId = this.route.snapshot.paramMap.get('pavilionId');

        fair.pavilions.forEach((pavilion) => {
          if (pavilion.id == pavilionId) {
            this.resources = pavilion.resources;
            this.pavilion = pavilion;
            this.scene = pavilion.resources.scenes[this.sceneId];
          }
        });
      }
      else if (this.router.url.indexOf('/stand') >= 0) {
        this.template = 'stand';

        const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
        const standId = this.route.snapshot.paramMap.get('standId');
        fair.pavilions.forEach((pavilion) => {
          if (pavilion.id == pavilionId) {
            this.pavilion = pavilion;
            pavilion.stands.forEach((stand) => {
              if (stand.id == standId) {
                this.resources = stand.resources;
                this.stand = stand;
                this.scene = stand.resources.scenes[this.sceneId];
              }
            });
          }
        });
      }

      if (!this.scene) {
        this.loading.dismiss();
        this.errors = `Algo malo ha ocurrido`;
        return;
      }
      this.scene.banners = this.scene.banners || [];
      this.onChangeBackgroundStyle();


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

        if (banner.formCatalog) {
          this.initializeFormsCatalogs(banner);
        }

        if (banner.contact) {
          this.initializeContact(banner);
        }
      });

      setTimeout(() => {
        this.loading.dismiss();
        this.initializeHtmlTexts(this.scene.banners);
        this.initializeCarousels();
      }, 1000);

      if (this.scene.menuTabs && this.scene.menuTabs.showMenuParent) {
        this.tabMenuObj = Object.assign({}, this.resources.menuTabs);
      }
      else {
        this.tabMenuObj = this.scene.menuTabs;
      }

      this.scene.container = this.scene.container || { 'w': window.innerWidth, 'h': window.innerHeight }
      this.onResize();

    }, error => {
      this.loading.dismiss();
      console.log(error);
      this.errors = `Consultando el servicio del mapa general de la feria [${error}]`;
    });

  }

  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent(this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  onRouterLink(tab) {
    //this.fullScreen = false;
    //window.dispatchEvent(    nt('map:fullscreenOff'));
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
    main.style.top = top + 'px';

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
      
      if (this.scene.render) {
        if (banner.size) { banner.size.x /= deltaW; banner.size.y /= deltaH; }
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
      if (banner.agendaCatalog) this.resizeAgendaCatalogs(banner);
      if (banner.speakerCatalog) this.resizeSpeakers(banner);
    });

    //Menu tab resize/render
    if (this.scene.menuTabs && this.scene.menuTabs.position)
      this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);

    //product catalog and carrete of images resize/render 
    this.onResizeCarousels();

  }

  initializeCatalogs(banner) {
    if (banner.__productCatalogList || banner.speakerCatalog || banner.type === 'Título') {
      for (var i = 10; i > 0; i--) {
        if ((i * banner.size.x <= this.scene.container.w) || ((i - 0.5) * banner.size.x <= this.scene.container.w)) {
          banner.__factor = i - 1;
          banner.__factor = i - 1;
          const main = document.querySelector<HTMLElement>('ion-router-outlet');
          const left = main.offsetWidth - (((banner.__factor) * 1.03) * banner.size.x);
          banner.position.x = left / 2;
          break;
        }
      }

    }
  }

  listenForFullScreenEvents() {

    window.addEventListener('map:fullscreenOff', (e: any) => {
      setTimeout(() => {
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
    window.addEventListener('window:resize', (user) => {
      setTimeout(() => {
        this.onResize();
      }, 100);
    });
  }

  initializeListeners() {
    window.addEventListener('window:resize-menu', () => {
      setTimeout(() => { this.onResize(); }, 100);
    });
  }

  async startAnimation(obj) {

    if (!obj.hoverEffects) return;

    if (!obj.startAnimation) {
      obj.startAnimation = true;
      if (obj.hoverEffects.includes('GirarDerecha')) {
        const squareA = this.animationCtrl.create()
          .addElement(document.querySelector('#obj-' + obj.id))

          .duration(1000)
          .keyframes([
            { offset: 0, transform: 'rotate(0)' },
            { offset: 0.5, transform: 'rotate(45deg)' },
            { offset: 1, transform: 'rotate(0) ' }
          ]);
        await squareA.play();
        obj.startAnimation = false;
      }
      if (obj.hoverEffects.includes('GirarIzquierda')) {
        const squareA = this.animationCtrl.create()
          .addElement(document.querySelector('#obj-' + obj.id))

          .duration(1000)
          .keyframes([
            { offset: 0, transform: 'rotate(0)' },
            { offset: 0.5, transform: 'rotate(-45deg)' },
            { offset: 1, transform: 'rotate(0) ' }
          ]);
        await squareA.play();
        obj.startAnimation = false;
      }
    }
  }

  goToInternalUrl(banner) {
    if (banner.internalUrl && banner.internalUrl.length > 0) {
      this.redirectTo(banner.internalUrl);
    }
    if (banner.formCatalog) {
      this.presentActionFormCatalog(banner);
    }
  }

  async presentActionFormCatalog(banner: any) {

    let formCatalog = banner.formCatalog;

    if (this.modal) { this.modal.dismiss(); }

    this.modal = await this.modalCtrl.create({
      component: FormCatalogComponent,
      swipeToClose: false,
      cssClass: 'product-modal',
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        '_parent': this,
        'fair': this.fair,
        'formCatalog': formCatalog,
        'userDataSession': this.userDataSession,
        'banner': banner
      }
    });
    await this.modal.present();

    const { data } = await this.modal.onWillDismiss();
    if (data) {

    }
  }

  initializeHtmlTexts(banners) {
    banners.forEach((banner) => {
      banner.textHtml = this.sanitizer.bypassSecurityTrustHtml(banner.text);
    });
  }

  initializeCarousels() {
    if (this.carousels && this.carousels._results) {
      this.carousels._results.forEach((elm) => {
        elm.initialize();
        elm.onResize();
      });
    }
  }

  onResizeCarousels() {
    if (this.carousels && this.carousels._results) {
      this.carousels._results.forEach((elm) => {
        elm.onResize();
      });
    }
  }

  initializeFormsCatalogs(banner) {

    banner.__formCatalog = { "agendas": [], "groups": [] };

    banner.__factor = 3;

    const category = banner.formCatalog.category || 'all';

    this.agendasService.list(null)
      .then((agendas) => {
        if (agendas.length > 0) {
          agendas.forEach((agenda) => {
            if (category == 'all' || agenda.category_id == category) {
              banner.__formCatalog.agendas.push(agenda);
            }
          });
          banner.__formCatalog.groups = [];
          this.transformSchedule(banner);
        }

      })
      .catch(error => {
        console.log(error);
      });
  }

  onToMapEditor(scene) {
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    const sceneId = this.route.snapshot.paramMap.get('sceneId');

    if (this.template === 'fair') {
      this.redirectTo(`/super-admin/map-editor/fair/${sceneId}`);
    }
    else if (this.template === 'pavilion') {
      this.redirectTo(`/super-admin/map-editor/pavilion/${pavilionId}/${sceneId}`);
    }
    else if (this.template === 'stand') {
      this.redirectTo(`/super-admin/map-editor/stand/${pavilionId}/${standId}/${sceneId}`);
    }
  }

  onToBackEditor(scene) {
    window.history.back();
  }

  onMouseWheel(evt) {
    const div = document.querySelector<HTMLElement>('.div-container');
    const scrollLeft = div.scrollLeft + evt.deltaY;
    const scrollTop = div.scrollTop + evt.deltaY;
    div.scrollLeft = scrollLeft;
    div.scrollTop = scrollTop;
  }

  mouseDownContainer(e, banner) {
    if (!banner || !banner.internalUrl) {
      this.moveMouseEvent = {
        "x": e.clientX || e.layerX || e.offsetX || e.pageX || e.screenX,
        "y": e.clientY || e.layerY || e.offsetY || e.pageY || e.screenY
      }
    };

  }

  mouseUpContainer(e) {
    this.moveMouseEvent = null;
  }

  mouseLeaveContainer(e) {
    this.moveMouseEvent = null;
  }

  /*@HostListener('document:mousemove', ['$event'])     
  onMouseMove(e) {
    if(this.moveMouseEvent) {
      const target = document.querySelector<HTMLElement>('.div-container');      

      const scrollTop = target.scrollTop;
      const scrollLeft = target.scrollLeft;
      let x  = e.clientX || e.layerX || e.offsetX || e.pageX || e.screenX;
      let y  =  e.clientY || e.layerY || e.offsetY || e.pageY || e.screenY;
      const deltaX = x - this.moveMouseEvent.x;
      const deltaY = y - this.moveMouseEvent.y;
      
     const newScrollX =  Number(scrollLeft) - deltaX;
     if(newScrollX>=0) {
       target.scrollTo(newScrollX, target.scrollTop);
       const offsetLeft = target.scrollLeft;
       
       if( newScrollX >= offsetLeft ) {
         document.querySelectorAll('.banner').forEach((banner:HTMLElement) => {
         //  banner.style.left = ( banner.offsetLeft + deltaX ) + 'px';
         });
         }
     } 
     
     
     const newScrollY = Number(scrollTop) - deltaY;
     target.scrollTo(newScrollX, newScrollY);
     const offsetTop = target.scrollTop;
     if(offsetTop != scrollTop )  { 
       document.querySelectorAll('.banner').forEach((banner:HTMLElement) => {
       //     banner.style.top  = ( banner.offsetTop + deltaY ) + 'px';
       }); 
     }
     
      //target.scrollTo(newScrollX, newScrollY);
      this.moveMouseEvent.x = x;
      this.moveMouseEvent.y = y;
      //document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-x',newScrollX.toString());
      //document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-y',newScrollY.toString());
    }
  }*/

  async onShowProduct(product) {

    if (this.modal) { this.modal.dismiss(); }

    this.modal = await this.modalCtrl.create({
      component: ProductDetailComponent,
      swipeToClose: false,
      cssClass: 'product-modal',
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        '_parent': this,
        'fair': this.fair, 'pavilionId': product.stand.pavilion_id, 'standId': product.stand_id, 'product': product
      }
    });
    await this.modal.present();

    const { data } = await this.modal.onWillDismiss();
    if (data) {

    }
  }

  initializeContact(banner) {
    banner.__contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
      subject: ['', Validators.required]
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

    const maxSize = banner.__productCatalogList.products.length + 1;
    banner.__productCatalogList.productCatalogEnd = (((maxSize / banner.__factor) * banner.size.y) + (banner.size.y * (maxSize / banner.__factor) * 0.03));

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
          banner.__agendaCatalogList.groups = [];
          this.transformSchedule(banner);
        }
        this.resizeAgendaCatalogs(banner);
      })
      .catch(error => {
        console.log(error);
      });
  }

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

  initializeSpeakers(banner) {

    banner.__speakerCatalogList = [];

    this.speakersService.list()
      .then((speakers) => {
        this.speakerList = speakers;
        this.filterSpeakerList(banner);
        this.onChangeSpeakerStyle(banner);
        this.resizeSpeakers(banner);
      })
      .catch(error => {

      });
  }

  resizeSpeakers(banner) {
    for (var i = 10; i > 0; i--) {
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

  changePriceProductCatalog(product, banner) {
    setTimeout(() => {
      if (this.carouselSlides && this.carouselSlides._results) {
        this.carouselSlides._results.forEach((elm) => {
          elm.ionSlideChange(elm);
        });
      }
    }, 5);

  }

  contactSendForm(form) {
    let sentToEmail = '';

    if (this.template == 'fair') {
      sentToEmail = this.fair.resources.supportContact;
    }
    if (this.template == 'stand') {
      sentToEmail = this.stand.merchant.email_contact;
    }
    const data = {
      'send_to': sentToEmail,
      'name': form.value.name,
      'email': form.value.email,
      'subject': form.value.subject,
      'message': form.value.message,
      'fairId': this.fair.id
    };

    this.loading.present({ message: 'Cargando...' });
    this.fairsService.sendMessage(data)
      .then((response) => {
        this.loading.dismiss();
        this.presentToast(response.message);
      }, error => {
        this.loading.dismiss();
        this.errors = error;
        this.presentToast(this.errors);
      });
  }

  async presenterLogin() {

    //if(this.modal) { this.modal.dismiss(); }

    this.modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if (data) {
    }
  }


  async presenterSpeakerModal(speaker) {

    this.modalSpeaker = await this.modalCtrl.create({
      component: SpeakerDetailComponent,
      cssClass: 'speaker-modal',
      swipeToClose: true,
      //backdropDismiss:false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { speaker: speaker }
    });
    await this.modalSpeaker.present();

    const { data } = await this.modalSpeaker.onWillDismiss();
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

  onChangeBackgroundStyle() {
    let ionContent = document.querySelector('#ionContent');
    ionContent.setAttribute("style", "--background:" + this.scene.backgroundColor);
  }

  async openShoppingCart(productPrice) {

    if (this.modal) { this.modal.dismiss(); }
    this.modal = await this.modalCtrl.create({
      component: ShoppingCartComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        'fair': this.fair,
        'type': 'Agenda',
        '_continue': true
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if (data) {
    }
  }

  async presentToast(message) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    await toast.present();
  }

  goToUrl(banner) {
    if (banner.externalUrl) {
      const windowReference = window.open();
      windowReference.location.href = banner.externalUrl;
    }
    else if (banner.internalUrl) {
      this.redirectTo(banner.internalUrl);
    }

  }

  logScrolling($event) {
    console.log($event);
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

  goToEditProduct(product) {
    const uri = '/super-admin/product/' + product.stand.pavilion_id + '/' + product.stand_id + '/' + product.id;
    this.router.navigate([uri])
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
    banner.__speakerCatalogList =
      this.speakerList.filter((speaker) => {
        return speaker.position == banner.speakerCatalog.speakerType;
      });
  }


}