import { Component, ElementRef,QueryList, ViewChild, ViewChildren, OnInit} from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../api/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { Animation, AnimationController } from '@ionic/angular';
import { TabMenuScenesComponent } from '../map/tab-menu-scenes/tab-menu-scenes.component';
import { DomSanitizer} from '@angular/platform-browser';
import { UsersService } from '../../api/users.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements OnInit {

  url: any;
  @ViewChild('menuTabs', { static: true }) menuTabs: TabMenuScenesComponent;  
  @ViewChildren('carrousel') carrousels: any;
  @ViewChildren('productCatalog') productCatalogs: any;    

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
  
  constructor(
    private fairsService: FairsService,
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController,
    private loading: LoadingService,
    private sanitizer: DomSanitizer,
    private usersService: UsersService) {
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

        this.initializeHtmlTexts(this.scene.banners);

        setTimeout(() => {
          this.initializeCarousels();
          this.initializeProductCatalogs();
          if(this.carrousels._results && this.carrousels._results.length> 0)  {
              setTimeout(() => {this.loading.dismiss(); },500 * this.carrousels._results.length);
          }
          else { this.loading.dismiss(); } 
        }, 5);
        
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
      
      target.setAttribute('scroll-x',scrollLeft.toString());
      target.setAttribute('scroll-y',scrollTop.toString());      
  }
*/

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
     this.redirectTo(banner.internalUrl);
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
  
  @HostListener('document:mousemove', ['$event'])     
  onMouseMove(e) {
    if(this.moveMouseEvent) {
      const target = document.querySelector('.div-container');      

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
  }

}
