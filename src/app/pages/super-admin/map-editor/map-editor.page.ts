import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FairsService } from './../../../api/fairs.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './../../../providers/loading.service';
import { PanelEditorComponent } from './panel-editor/panel-editor.component';
import { AlertController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.page.html',
  styleUrls: ['./map-editor.page.scss'],
})
export class MapEditorPage implements OnInit {

  errors = null;
  fair = null;
  fullScreen = false;
  background = null;
  sceneSelect = null;
  showTools = null;
  editSave = false;
  panelPos = { x: '27px', y: '0px' };
  resources = null;
  tabSelect = 'position';
  isHover = {};
  @ViewChild('inputWidth', { static: true }) inputWidth: ElementRef;
  
  constructor(
    private fairsService: FairsService,
    private route: ActivatedRoute,
	private router: Router,
	private modalCtrl: ModalController,
	private routerOutlet: IonRouterOutlet,
    private loading: LoadingService,
	private adminFairsService: AdminFairsService) 
  { }

  ngOnInit() {
     this.loading.present({message:'Cargando...'});
	 const template = this.route.snapshot.paramMap.get('template');

	 this.fairsService.getCurrentFair().then((fair)=>{
	    if(template === 'fair') {
		  this.background = fair.resources.url_image;
		  this.fair = fair;
		  this.resources = fair.resources;
	    }
        this.loading.dismiss();
		this.resize();
     }, error => {
        this.loading.dismiss();
		this.errors = `Consultando el servicio del mapa general de la feria`;
     });
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));    
  }

  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
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
  
  onSceneSelect(sceneSelect) {
	  this.sceneSelect = sceneSelect;
	  this.tabSelect = 'position';
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
	  this.adminFairsService.update(this.fair);
  }
  
  addScene() {
	  const id = new Date().valueOf();
	  this.resources.banners.push({'position':{}, 'rotation':{},'size':{},'id': id});
  }
  
  dragEnd(event) {
    const panel = document.querySelector<HTMLElement>('.pane-scene-select');
	this.panelPos.y = ( panel.offsetTop  + event.y ) + 'px';
	this.panelPos.x = ( panel.offsetLeft  + event.x ) + 'px';
  }
  
  deleteScene(sceneSelect) {
	this.resources.banners = this.resources.banners.filter((scene)=>{
		return sceneSelect != scene; 
	});
	
	this.sceneSelect = null;
  }
  
}
