import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { FairsService } from './../../api/fairs.service';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
    
  fullScreen = false;
  resources: any;
  intro = false;
  errors = null;
  fair = null;
  isHover = null;
  background = null;

  constructor(
    private fairsService: FairsService,
    private router: Router,
    private loading: LoadingService) {
        
		
  }
  
  ngAfterViewInit() {
    this.errors = null;
	
	this.loading.present({message:'Cargando...'});
    this.fairsService.getCurrentFair().then((fair)=>{
		this.background = fair.resources.url_image;
		this.fair = fair;
	    this.resources = fair.resources;
		this.loading.dismiss();
		this.resize();

        
    }, error => {
        this.loading.dismiss();
        console.log(error);
		this.errors = `Consultando el servicio del mapa general de la feria`;
    });
  }

  onLoadingDismiss(){
    this.loading.dismiss();
  }

  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
    
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
  }
  
  ngOnDestroy(): void {
    
  }
  
  resize() {
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
	 const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
	 main.style.top = top + 'px';
	 
	 const backgr = document.querySelector<HTMLElement>('#background');
	 const height = main.offsetHeight - top  > backgr.offsetHeight ? main.offsetHeight - top : backgr.offsetHeight;
	 
	 const width = 1140; 
	 backgr.style.height = height + 'px';
	 backgr.style.width = width + 'px';
	 
	 
	 const div = document.querySelector<HTMLElement>('.div-container');
     div.addEventListener('scroll', this.logScrolling);
	 
  }
  
  logScrolling(e) {
	  
	  let target = e.target;
	  const sceneEl = document.querySelector<HTMLElement>('.scene');
	  sceneEl.style.top += 20;
	  
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
  
}
