import { Component, ElementRef,QueryList, ViewChild, ViewChildren, OnInit} from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../api/fairs.service';
import { ProductsService } from './../../api/products.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { Animation, AnimationController } from '@ionic/angular';
import { TabMenuScenesComponent } from '../map/tab-menu-scenes/tab-menu-scenes.component';
import { ProductDetailComponent } from '../product-catalog/product-detail/product-detail.component';
import { DomSanitizer} from '@angular/platform-browser';
import { UsersService } from '../../api/users.service';
import { AlertController, ModalController, IonRouterOutlet,ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SpeakerDetailComponent } from '../speaker-list/speaker-detail/speaker-detail.component';
import { SpeakersService } from '../../api/speakers.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements OnInit {

  url: any;
  number = Number;
  @ViewChild('menuTabs', { static: true }) menuTabs: TabMenuScenesComponent;  
  @ViewChildren('carrousel') carrousels: any;
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
  tabMenuObj:any;
  resources = null;
  template = null;
  bannerSelectHover = null;
  showlogScrolling = false;
  profileRole:any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
  };
  modalSpeaker: any;
  
  constructor(
    private fairsService: FairsService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController,
    private loading: LoadingService,
    private sanitizer: DomSanitizer,
    private usersService: UsersService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private formBuilder: FormBuilder,
	private speakersService: SpeakersService) {
        
      this.url = window.location.origin;
      this.listenForFullScreenEvents();
      this.usersService.getUser().then((userDataSession: any)=>{
          if(userDataSession && userDataSession.user_roles_fair)  {
            this.profileRole = {};
            userDataSession.user_roles_fair.forEach((role)=>{
                if(role.id == 1) { //"super_administrador"
                   this.profileRole.admin = true;
                }
             });
             
          }
      });
  }
  
  ngOnInit() {
    const div = document.querySelector<HTMLElement>('.div-container');
    //div.addEventListener('scroll', this.logScrolling);
  } 
  
  ngOnDestroy(): void {
     if(window.location.href.indexOf('/#/map/') < 0)
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
    this.errors = null;
    this.loading.present({message:'Cargando...'});

    this.fairsService.getCurrentFair().then((fair)=>{
        this.fair = fair;
        if(this.router.url.indexOf('/fair') >=0 ) {
            this.template = 'fair';
            const sceneId = this.route.snapshot.paramMap.get('sceneId');
            this.scene = fair.resources.scenes[sceneId];
            this.resources = fair.resources;
        }
        else if(this.router.url.indexOf('/pavilion') >= 0) {
            this.template = 'pavilion';
            const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
            const sceneId = this.route.snapshot.paramMap.get('sceneId');
            
            fair.pavilions.forEach((pavilion)=>{
                if(pavilion.id == pavilionId) {
                      this.resources = pavilion.resources;
                      this.pavilion = pavilion;
                      this.scene = pavilion.resources.scenes[sceneId];
                }
            });
        }
        else if(this.router.url.indexOf('/stand') >= 0) {
          this.template = 'stand';
          const sceneId = this.route.snapshot.paramMap.get('sceneId');
          const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
          const standId = this.route.snapshot.paramMap.get('standId');
          fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId) {
                this.pavilion = pavilion;
                pavilion.stands.forEach((stand)=>{
                   if(stand.id == standId) {
                      this.resources = stand.resources;
                      this.stand = stand;
                      this.scene = stand.resources.scenes[sceneId];
                   }
                });
              }
          });
        }
        
        this.scene.banners = this.scene.banners || [];
        this.scene.banners.forEach((banner)=>{
            if(banner.video)
            banner.video.sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(banner.video.url);
        });

        this.scene.banners.forEach((banner)=>{
           if(banner.productCatalog) {
               this.initializeProductCatalogs(banner);
		   }
		});
        
        this.scene.banners.forEach((banner)=>{
           if(banner.contact) {
             this.initializeContact(banner);
           }
        });

        this.scene.banners.forEach((banner)=>{
           if(banner.speakers) {
             this.initializeSpeakers(banner);
           }
        });

        setTimeout(() => {
          this.initializeHtmlTexts(this.scene.banners);
          this.initializeCarousels();
          this.loading.dismiss();
        }, 15);
        
        if(this.scene.menuTabs.showMenuParent) {
           this.tabMenuObj = Object.assign({}, this.resources.menuTabs);
        }
        else {
            this.tabMenuObj = this.scene.menuTabs;
        }
        
        this.onResize();
        
    }, error => {
        this.loading.dismiss();
        console.log(error);
        this.errors = `Consultando el servicio del mapa general de la feria [${error}]`;
    });

  }

  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
    
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
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
        if(banner.size) banner.size.x /= deltaW;
        if(banner.size) banner.size.y /= deltaH;
        if(banner.position) banner.position.x /= deltaW;
        if(banner.position) banner.position.y /= deltaH;
        if(banner.fontSize > 0 ) banner.fontSize /= deltaW;
        if(banner.border && banner.border.radius > 0) banner.border.radius /= deltaH;
        if(banner.productCatalog ) {
           if(banner.productCatalog.buttonWidth > 0) banner.productCatalog.buttonWidth /= deltaW;
           if(banner.productCatalog.buttonHeight > 0) banner.productCatalog.buttonHeight /= deltaW;
           if(banner.productCatalog.buttonFontSize > 0) banner.productCatalog.buttonFontSize /= deltaW;
           if(banner.productCatalog.buttonFontWeight > 0) banner.productCatalog.buttonFontWeight /= deltaW;
           if(banner.productCatalog.buttonRight > 0) banner.productCatalog.buttonRight /= deltaW;
           if(banner.productCatalog.buttonBottom > 0) banner.productCatalog.buttonBottom /= deltaW;
           
           if(banner.productCatalog.titleFontSize > 0) banner.productCatalog.titleFontSize /= deltaW;
           if(banner.productCatalog.titleFontWeight > 0) banner.productCatalog.titleFontWeight /= deltaW;
           if(banner.productCatalog.titleLeft > 0) banner.productCatalog.titleLeft /= deltaW;
           if(banner.productCatalog.titleTop > 0) banner.productCatalog.titleTop /= deltaW;
           if(banner.productCatalog.descTop > 0) banner.productCatalog.descTop /= deltaW;
           if(banner.productCatalog.descLeft > 0) banner.productCatalog.descLeft /= deltaW;
           if(banner.productCatalog.descWidth > 0) banner.productCatalog.descWidth /= deltaW;
           if(banner.productCatalog.descFontSize > 0) banner.productCatalog.descFontSize /= deltaW;
           //if(banner.productCatalog.lineHeight > 0) banner.productCatalog.lineHeight /= deltaH;
           
           if(banner.productCatalog.priceTop > 0) banner.productCatalog.priceTop /= deltaW;
           if(banner.productCatalog.priceLeft > 0) banner.productCatalog.priceLeft /= deltaW;
           if(banner.productCatalog.priceFontSize > 0) banner.productCatalog.priceFontSize /= deltaW;
           if(banner.productCatalog.imageTop > 0) banner.productCatalog.imageTop /= deltaW;
           if(banner.productCatalog.imageLeft > 0) banner.productCatalog.imageLeft /= deltaW;
           if(banner.productCatalog.imagesWidth > 0) banner.productCatalog.imagesWidth /= deltaW;
           if(banner.productCatalog.imagesHeight > 0) banner.productCatalog.imagesHeight /= deltaW;
           if(banner.productCatalog.imagesPriceWidth > 0) banner.productCatalog.imagesPriceWidth /= deltaW;
        }
     }); 
     
     //Menu tab resize/render
     this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);
     
     //product catalog and carrete of images resize/render 
     this.onResizeCarousels();
     
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

    if(!obj.startAnimation) {
      obj.startAnimation = true;
      if(obj.hoverEffects.includes('GirarDerecha')) {
        const squareA = this.animationCtrl.create()
        .addElement(document.querySelector('#obj-' + obj.id))
      
        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'rotate(0)' },
          { offset: 0.5, transform: 'rotate(45deg)' },
          { offset: 1, transform: 'rotate(0) '}
        ]);
        await squareA.play();
        obj.startAnimation = false;
      }
      if(obj.hoverEffects.includes('GirarIzquierda')) {
        const squareA = this.animationCtrl.create()
        .addElement(document.querySelector('#obj-' + obj.id))
        
        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'rotate(0)' },
          { offset: 0.5, transform: 'rotate(-45deg)' },
          { offset: 1, transform: 'rotate(0) '}
        ]);
        await squareA.play();
        obj.startAnimation = false;
      }
    }
  }
  
  goToInternalUrl(banner){
     if(banner.internalUrl && banner.internalUrl.length > 0) {
        this.redirectTo(banner.internalUrl);
     }
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
  
  onResizeCarousels() {
    if(this.carrousels && this.carrousels._results ) {
        this.carrousels._results.forEach((elm)=>{
            elm.onResize();
        });
    }    
  }
  
  onToMapEditor(scene){
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    const sceneId = this.route.snapshot.paramMap.get('sceneId');
    const urlBase = window.location.href.split('#')[0];
    
    if(this.template === 'fair') {
      window.location.href = urlBase + "#/super-admin/map-editor/fair/"+sceneId;
    }
    else if(this.template === 'pavilion') {
      window.location.href = urlBase + "#/super-admin/map-editor/pavilion/"+pavilionId+"/"+sceneId;
    }
    else if(this.template === 'stand') {
      window.location.href = urlBase + "#/super-admin/map-editor/stand/"+pavilionId+"/"+standId+"/"+sceneId;
      
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

  mouseDownContainer(e,banner) {
    if(!banner || !banner.internalUrl) {
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

  initializeContact(banner) {
      banner.__contactForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        message: ['', Validators.required],
        subject: ['', Validators.required]
         });
  }
  
  initializeProductCatalogs(banner) {
   
      banner.__catalog = {"products":[]};
      let remark = banner.productCatalog.list;
        
      let str = remark.split(';')[0];    
      const pavilion = str.split(':')[1];
      str = remark.split(';')[1];
      const stand = str.split(':')[1];
      str = remark.split(';').length==3 ? remark.split(';')[2] : null;
      const category = str ? str.split(':')[1] : '';
    
      this.productsService.get(this.fair.id,pavilion,stand,null)
      .then((products) => {
        if(products.length > 0) {
            products.forEach((product)=>{
                if(category == 'all' || product.category_id == category ){
                    product.url_image = product.resources && product.resources.main_url_image ? product.resources.main_url_image : product.prices[0].resources.images[0].url_image;
                    banner.__catalog.products.push(product);
                    product.priceSelected = product.prices[0];
                }
            });
        }
      })
      .catch(error => {
        
      });
  }
  
  initializeSpeakers(banner) {
   
      banner.__speakers = [];
      
      this.speakersService.list()
      .then((speakers) => {
		  console.log(speakers);
        
		 if(speakers)
		 speakers.forEach((speaker)=>{
		   //product.url_image = product.resources && product.resources.main_url_image ? product.resources.main_url_image : product.prices[0].resources.images[0].url_image;
		   banner.__speakers.push(speaker);
		 });
        
      })
      .catch(error => {
        
      });
  }
  
  changePriceProductCatalog(product,price,price2){
    
  }

  contactSendForm(form){
      console.log(form.value);
  }  

  async presenterSpeakerModal(speaker) {
    
    this.modalSpeaker = await this.modalCtrl.create({
      component: SpeakerDetailComponent,
      cssClass: 'speaker-modal',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { speaker: speaker }
    });
    await this.modalSpeaker.present();

    const { data } = await this.modalSpeaker.onWillDismiss();
  }


}
