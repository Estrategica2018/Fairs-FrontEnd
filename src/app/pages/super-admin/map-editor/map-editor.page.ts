import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../../api/fairs.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './../../../providers/loading.service';
import { PanelEditorComponent } from './panel-editor/panel-editor.component';
import { AlertController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.page.html',
  styleUrls: ['./map-editor.page.scss'],
})
export class MapEditorPage implements OnInit {

  errors = null;
  
  fullScreen = false;
  fair = null;
  bannerSelect = null;
  showTools = null;
  editSave = false;
  panelPos = { x: '27px', y: '0px' };
  mainObj = null;
  resources = null;
  sceneId = null;
  objId = null;
  scene = null;
  template = null;
  showTool = null;
  tabSelect = 'position';
  isHover = {};
  hoverEffects = [ {"name":"GirarDerecha","isChecked":false},{"name":"GirarIzquierda","isChecked":false}];
  @ViewChild('inputWidth', { static: true }) inputWidth: ElementRef;
  
  constructor(
    private fairsService: FairsService,
    private route: ActivatedRoute,
	private router: Router,
	private modalCtrl: ModalController,
	private routerOutlet: IonRouterOutlet,
    private loading: LoadingService,
	private animationCtrl: AnimationController,
	private adminFairsService: AdminFairsService) { 
      
	  this.listenForFullScreenEvents();
  }

   ngOnInit() {
	  
	 this.loading.present({message:'Cargando...'});
	 this.template = this.route.snapshot.paramMap.get('template');
	 this.objId = this.route.snapshot.paramMap.get('objId');
	 this.sceneId = this.route.snapshot.paramMap.get('sceneId');

	 this.fairsService.getCurrentFair().then((fair)=>{
		const div = document.querySelector<HTMLElement>('.div-container');
        div.addEventListener('scroll', this.logScrolling);
		
		this.fair = fair;
		
		
		
	    if(this.template === 'fair') {
		  this.resources = fair.resources;
		  this.scene = fair.resources[this.sceneId];
	    }
		if(this.template === 'pavilion') {
		  this.fair.pavilions.forEach((pavilion)=>{
			  if(pavilion.id === this.objId) {
				this.scene = pavilion.resources[this.sceneId];
				this.resources = fair.resources;
				this.scene = fair.resources[this.sceneId];	  
			  }
		  });
		}
		
		this.loading.dismiss();
		this.onResize();
     }, error => {
        this.loading.dismiss();
		this.errors = `Consultando el servicio del mapa general de la feria`;
     });
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));
	this.onResize();
  }
  
  onChangeOpacity() {
	  const originYRange : any= document.querySelector('.origin-y-range');
	  this.bannerSelect.opacity = originYRange.value / 100;
  }
  
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
  }
  
  
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
	 
	 let newHeight = main.offsetHeight - top;
	 this.scene.container = this.scene.container || { 'w': main.offsetWidth };
	 let _height = this.scene.container.h;
     let _width = this.scene.container.w;
	 let newWidth = newHeight * _width / _height;
	
	 if(this.fullScreen && newWidth < window.innerWidth ) {
//		newWidth = window.innerWidth;
	  //  newHeight = newWidth * _height / _width;
	 }
	//
	//const deltaWidth = (newWidth - oriWidth) * 100 / newWidth;
	//console.log('deltaWidth['+deltaWidth+']');
	 let deltaH = _height / newHeight;
	 //this.scene.container.h = newHeight;
	 
	 //main.style.height = newHeight + 'px';
	 
	 
	 this.scene.banners.forEach((banner)=>{
		 
		//banner.size.y = this.fullScreen ? ( banner.size.y + banner.size.y * deltaH ) : banner.size.y;
		//banner.size.x += deltaHeight;
	 });
	 
	 
	 
  }
  
  logScrollStart() {
	  console.log('logScrollStart');
  }
  logScrollEnd() {
	  console.log('logScrollEnd');
  }
  logScrolling(e) {
	  
	  let target = e.target;
	  document.querySelector<HTMLElement>('.scene').style.top += 20;
	  
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
  
  onbannerSelect(bannerSelect) {
	  this.bannerSelect = bannerSelect;
	  this.tabSelect = 'position';
	  this.bannerSelect.hoverEffects = this.bannerSelect.hoverEffects || '';
	  this.hoverEffects.forEach((effect)=>{
		 effect.isChecked = this.bannerSelect.hoverEffects.includes(effect.name);
	  });
	  this.initializePanel();
  }
  
  onChangeItem() {
	  this.editSave = true;
  }
  
  /*async presentPanel(event, banner) {
    const modal = await this.modalCtrl.create({
      component: PanelEditorComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
		  'scene': banner
	  }
    });
    await modal.present();
    this.success = null;
	this.errors = null;
    const { data } = await modal.onWillDismiss();
	
	if (data) {
	  
	} 
  }*/
  
  initializePanel() {
	  const inputs = Array.from(document.querySelectorAll('input-form'));
	  inputs.forEach((input) => {
		  input.addEventListener('ionInput', this.onChangeItem);
	  });
  }
  
  onSave() {
	  if(this.template === 'fair') {
		  this.onSaveFair();
	  }
  }
  
  onSaveFair() {
	  this.fair.resources[this.sceneId] = this.scene;
	  this.adminFairsService.update(this.fair);
  }
  onSavePavilion() {
	  this.adminFairsService.update(this.fair);
  }
  onSaveStand() {
	  this.adminFairsService.update(this.fair);
  }
  
  addBanner() {
	  const id = new Date().valueOf();
	  const banner = {"position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id,"perspective":400, "border":{"radius":10}};
	  this.scene.banners.push(banner);
  }
  
  dragEnd(event) {
    const panel = document.querySelector<HTMLElement>('.pane-scene-select');
	this.panelPos.y = ( panel.offsetTop  + event.y ) + 'px';
	this.panelPos.x = ( panel.offsetLeft  + event.x ) + 'px';
  }
   
  deleteScene(bannerSelect) {
	this.scene.banners = this.scene.banners.filter((banner)=>{
		return bannerSelect != banner; 
	});
	
	this.bannerSelect = null;
  }
  
  listenForFullScreenEvents() {
	
    window.addEventListener('map:fullscreenOff', (e:any) => {
        setTimeout(() => {
		  this.fullScreen = false;
		  const main = document.querySelector<HTMLElement>('ion-router-outlet');
		  let newWidth = main.offsetWidth;
		  let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
		  this.scene.container.w = newWidth;
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
  
  onChangeEffect(effectChange) {
	  
	  this.bannerSelect.hoverEffects = '';
	  this.hoverEffects.forEach((effect)=>{
		  if( ( effect.name !== effectChange.name && effect.isChecked ) || ( effect.name === effectChange.name && !effectChange.isChecked ) ) {
		     this.bannerSelect.hoverEffects += effect.name + ";";
		  }
	  });
  }
  
}



