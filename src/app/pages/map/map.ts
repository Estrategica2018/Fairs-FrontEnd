import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../api/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit, OnInit {
    
  fullScreen = false;
  scene: any;
  intro = false;
  errors = null;
  fair = null;
  isHover = null;
  marginTabs = '444';
  
  constructor(
    private fairsService: FairsService,
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController,
    private loading: LoadingService) {
      this.listenForFullScreenEvents();
  }
  
  ngOnInit() {
     //this.initializeScreen();
  }
  
  ngAfterViewInit() {
     this.initializeScreen();
  }
  
  ngDoCheck(){
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
     main.style.top = top + 'px';
     
     this.initializeMenu();
  }
  
  initializeScreen() {
    this.errors = null;
    this.loading.present({message:'Cargando...'});

    this.fairsService.getCurrentFair().then((fair)=>{
        this.fair = fair;
        this.loading.dismiss();
        
        if(this.router.url.indexOf('/fair') >=0 ) {
            const sceneId = this.route.snapshot.paramMap.get('sceneId');
            this.scene = fair.resources.scenes[sceneId];
        }
        else if(this.router.url.indexOf('/pavilion') >= 0) {
            const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
            const sceneId = this.route.snapshot.paramMap.get('sceneId');
            
            fair.pavilions.forEach((pavilion)=>{
                if(pavilion.id == pavilionId) {
                      this.scene = pavilion.resources.scenes[sceneId];
                }
            });
        }
        
        this.scene.banners = this.scene.banners || [];
        this.onResize();
        
    }, error => {
        this.loading.dismiss();
        console.log(error);
        this.errors = `Consultando el servicio del mapa general de la feria`;
    });
  
    const div = document.querySelector<HTMLElement>('.div-container');
    div.addEventListener('scroll', this.logScrolling);
  }

  onLoadingDismiss(){
    this.loading.dismiss();
  }

  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));    
    this.onResize();         
  }
    
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
  }
  
  ngOnDestroy(): void {
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {

     if(!this.scene.container) return;
     
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     const top = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
     main.style.top = top + 'px';
     
     let newWidth = main.offsetWidth;
     let deltaW =  this.scene.container.w / newWidth;
     let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
     let deltaH = this.scene.container.h / newHeight;
     
     this.scene.container.w = newWidth;
     if(newHeight<main.offsetWidth) {
        newHeight = main.offsetHeight - top;
     }
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
     this.initializeMenu();
  }
  
  initializeMenu() {
     const tabsmenu = document.querySelector<HTMLElement>('.tabs-menu');
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     
     if(tabsmenu && tabsmenu.offsetWidth > 0) {
         this.marginTabs = ((main.offsetWidth - tabsmenu.offsetWidth) / 2) + 'px';
     }
     else {
         setTimeout(function(){ this.initializeMenu(); }, 3000);
     }
  }

  logScrolling(e) {
      
      let target = e.target;
      //document.querySelector<HTMLElement>('.scene').style.top += 20;
      
      const scrollLeft = document.querySelector<HTMLElement>('.div-container').scrollLeft;
      const scrollTop = document.querySelector<HTMLElement>('.div-container').scrollTop;
      const oldScrollX = Number(document.querySelector<HTMLElement>('.div-container').getAttribute('scroll-x'));
      const oldScrollY = Number(document.querySelector<HTMLElement>('.div-container').getAttribute('scroll-y'));
      const deltaX = scrollLeft - oldScrollX;
      const deltaY = scrollTop - oldScrollY;
      
      document.querySelectorAll('.scene').forEach((scene:HTMLElement) => {
          scene.style.left = ( scene.offsetLeft - deltaX ) + 'px';  
          scene.style.top  = ( scene.offsetTop - deltaY ) + 'px';
      });
      
      document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-x',scrollLeft.toString());
      document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-y',scrollTop.toString());      
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
      .addElement(document.querySelector('#obj-' + obj.id))
      
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
      .addElement(document.querySelector('#obj-' + obj.id))
      
      .duration(1000)
      .keyframes([
        { offset: 0, transform: 'rotate(0)' },
        { offset: 0.5, transform: 'rotate(-45deg)' },
        { offset: 1, transform: 'rotate(0) '}
      ]);
      await squareA.play();
    }
  }
  
  goToInternalUrl(banner){
     this.onRouterLink(banner.internalUrl);
  }
  
}
