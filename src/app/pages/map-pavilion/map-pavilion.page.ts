import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../api/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'page-map-pavilion',
  templateUrl: 'map-pavilion.page.html',
  styleUrls: ['./map-pavilion.page.scss']
})
export class MapPavilionPage implements AfterViewInit, OnInit {
    
  fullScreen = false;
  scene: any;
  intro = false;
  errors = null;
  fair = null;
  isHover = null;
  ori_container = null;
  
  constructor(
    private fairsService: FairsService,
    private route: ActivatedRoute,
	private router: Router,
	private animationCtrl: AnimationController,
    private loading: LoadingService) {
      this.listenForFullScreenEvents();
  }
  
  ngOnInit() {
	  this.initializeScreen();
  }
  
  ngAfterViewInit() {
	  this.initializeScreen();
  }
  
  initializeScreen() {
    this.errors = null;
	this.loading.present({message:'Cargando...'});
    
	this.fairsService.getCurrentFair().then((fair)=>{
		this.fair = fair;
		this.loading.dismiss();
		const sceneId = this.route.snapshot.paramMap.get('sceneId');
	    if(this.router.url.indexOf('/fair') >=0 ) {
			this.scene = fair.resources[sceneId];
			
		}
		else if(this.router.url.indexOf('/pavilion') >= 0) {
			const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
			const sceneId = this.route.snapshot.paramMap.get('sceneId');
			fair.pavilions.forEach((pavilion)=>{
				if(pavilion.id == pavilionId) {
   				   this.scene = pavilion.resources[sceneId];
				}
			});
		}
		this.scene.container = {'w': 1144,'h': 569};
		this.scene.banners = this.scene.banners || [];
		
		const main = document.querySelector<HTMLElement>('ion-router-outlet');
		this.ori_container = { "w": main.offsetWidth, "y": main.offsetHeight };
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
    
  }
  
  /*@HostListener('window:resize', ['$event'])
  onResize() {
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
	 const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
	 main.style.top = top + 'px';
	 
	 const backgr = document.querySelector<HTMLElement>('#background');
	 const height = main.offsetHeight - top  > backgr.offsetHeight ? main.offsetHeight - top : backgr.offsetHeight;
	 
	 const width = 1140; 
	 backgr.style.height = height + 'px';
	 backgr.style.width = width + 'px';
	 
	 
	 
	 
  }*/
  
  @HostListener('window:resize', ['$event'])
  onResize() {
        
		const videoElem = <HTMLMediaElement>document.getElementById('videoMeeting_');
        
        if(videoElem) {
            /*
			const container = this.canvas.nativeElement;
            const heightFull = container.clientHeight;
            let width = heightFull * this.resources._defaultWidth / this.resources._defaultHeight;
            let height = heightFull;
            if(width<container.clientWidth) {
              let widthFull = container.clientWidth;
              height = widthFull * this.resources._defaultHeight / this.resources._defaultWidth;
              width = widthFull;
            }
            this.width = width;
            this.height = height;
        
            videoElem.style.width = width + 'px';
              videoElem.style.height = height + 'px';
		   */
        }
  
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
	 const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
	 main.style.top = top + 'px';
	 
	 const tabsmenu = document.querySelector<HTMLElement>('.tabs-menu');
	 tabsmenu.style.bottom = top + 'px';
	 
	 const left = (main.offsetWidth - 406) / 2;
	 tabsmenu.style.left = left + 'px';
	 
	 var deltaW = ( main.offsetWidth / this.ori_container.w );
	 this.scene.banners.forEach((banner)=>{
		 
		//banner.size.y = this.fullScreen ? ( banner.size.y + banner.size.y * deltaH ) : banner.size.y;
		//banner.size.x += deltaHeight;
		if(banner.size) banner.size.x *= deltaW;
	 });
	 
	 this.ori_container.w = main.offsetWidth;
	 this.ori_container.y = deltaW * this.scene.container.y / this.scene.container.w;
  }
  
  logScrolling(e) {
	  
	  let target = e.target;
	  
	  const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
	  const sceneEl = document.querySelector<HTMLElement>('.scene');
	  //sceneEl.style.top += top;
	  
	  const scrollLeft = document.querySelector<HTMLElement>('.div-container').scrollLeft;
	  const scrollTop = document.querySelector<HTMLElement>('.div-container').scrollTop;
	  const oldScrollX = Number(document.querySelector<HTMLElement>('.div-container').getAttribute('scroll-x'));
	  const oldScrollY = Number(document.querySelector<HTMLElement>('.div-container').getAttribute('scroll-y'));
      const deltaX: number = scrollLeft - oldScrollX;
	  const deltaY: number = scrollTop - oldScrollY;
	  
	  document.querySelectorAll<HTMLElement>('.scene').forEach((scene:HTMLElement)=>{
		  scene.style.left = ( scene.offsetLeft - deltaX ) + 'px';  
		  scene.style.top  = ( scene.offsetTop - deltaY ) + 'px';
	  });
	  
	  document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-x',scrollLeft.toString());
	  document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-y',oldScrollY.toString());
	  
	  
	  switch (target.id) {
		case 'btnScrollLeft':
		    console.log('logScrolling  - btnScrollLeft');  
		  break;
		case 'btnScrollTop':
		  console.log('logScrolling - btnScrollTop');
		break;
	  } 
  }
  
  
  listenForFullScreenEvents() {
	
    window.addEventListener('map:fullscreenOff', (e:any) => {
        setTimeout(() => {
		  this.fullScreen = false;
		  const main = document.querySelector<HTMLElement>('ion-router-outlet');
		  let newWidth = main.offsetWidth;
		  let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
		  this.scene.container.w = newWidth;
		  if(newHeight<main.offsetWidth) {
			  const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
			  newHeight = main.offsetHeight - top;
			  newWidth = newHeight * this.scene.container.w / this.scene.container.h;
		  }
		  this.scene.container.h = newHeight;
          this.onResize();
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e:any) => {
        setTimeout(() => {
		  this.fullScreen = true;
		  const main = document.querySelector<HTMLElement>('ion-router-outlet');
		  let newWidth = main.offsetWidth;
		  let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
		  this.scene.container.w = newWidth;
		  this.scene.container.h = newHeight;
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
				{ offset: 0, transform: 'scale(1) rotate(0)' },
				{ offset: 0.5, transform: 'scale(1.2) rotate(45deg)' },
				{ offset: 1, transform: 'scale(1) rotate(0) '}
			  ]);
		   
		await squareA.play();
	}
	if(obj.hoverEffects.includes('GirarIzquierda')) {
		const squareA = this.animationCtrl.create()
			  .addElement(document.querySelector('#obj-' + obj.id))
			  
			  .duration(1000)
			  .keyframes([
				{ offset: 0, transform: 'scale(1) rotate(0)' },
				{ offset: 0.5, transform: 'scale(1.2) rotate(-45deg)' },
				{ offset: 1, transform: 'scale(1) rotate(0) '}
			  ]);
		   
		await squareA.play();
	}
  }
  
}
