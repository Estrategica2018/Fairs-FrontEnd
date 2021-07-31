import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { HostListener } from "@angular/core";
import { FairsService } from './../../../api/fairs.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { AdminPavilionsService } from './../../../api/admin/pavilions.service';
import { AdminStandsService } from './../../../api/admin/stands.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from './../../../providers/loading.service';
import { PanelEditorComponent } from './panel-editor/panel-editor.component';
import { AlertController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
import { processData } from '../../../providers/process-data';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.page.html',
  styleUrls: ['./map-editor.page.scss'],
})
export class MapEditorPage implements OnInit {

  errors = null;
  
  fullScreen = false;
  fair = null;
  pavilion = null;
  stand = null;
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
  borderStyles = ["none","dotted","dashed","solid","double","groove","ridge","inset","outset","hidden"];
  
  constructor(
    private alertCtrl: AlertController,
    private fairsService: FairsService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private loading: LoadingService,
    private animationCtrl: AnimationController,
    private adminFairsService: AdminFairsService,
    private adminPavilionsService: AdminPavilionsService,
    private adminStandsService: AdminStandsService) { 
      
      this.listenForFullScreenEvents();
  }

   ngOnInit() {
      
     this.loading.present({message:'Cargando...'});
     this.template = this.route.snapshot.paramMap.get('template');
     this.objId = this.route.snapshot.paramMap.get('objId');
     this.sceneId = this.route.snapshot.paramMap.get('sceneId');
     
     const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
     const main = document.querySelector<HTMLElement>('ion-router-outlet');

     main.style.top = top + 'px';

     this.fairsService.getCurrentFair().then((fair)=>{
        const div = document.querySelector<HTMLElement>('.div-container');
        div.addEventListener('scroll', this.logScrolling);
        this.fair = fair;
        if(this.template === 'fair') {
          this.resources = fair.resources;
          this.scene = this.sceneId ? fair.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
        }
        else if(this.template === 'pavilion') {
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == this.objId) {
				this.pavilion = pavilion;
                this.resources = pavilion.resources;
				this.scene = this.sceneId ? this.pavilion.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
              }
          });
        }
        else if(this.template === 'stand') {
          const pavilionId = this.objId.split('_')[0];
          const standId = this.objId.split('_')[1];
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId) {
                this.pavilion = pavilion;
                pavilion.stands.forEach((standEl)=>{
                    if(standEl.id == standId) {
                       this.stand = standEl;
                    }
                })
                this.pavilion = pavilion;
                this.resources = this.stand.resources;
                this.scene = this.sceneId ? this.stand.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
              }
          });
        }
        
        this.scene.container = this.scene && this.scene.container ? this.scene.container : {'w': 1290,'h': 767};
        this.scene.ori_container = this.scene.container;
        this.scene.banners = this.scene.banners || [];
        
        this.scene.banners.forEach((banner)=> {
            
        });
        this.loading.dismiss();
        this.onResize();
     }, error => {
        this.loading.dismiss();
        this.errors = `Consultando el servicio del mapa general de la feria`;
     });
  }
  
  ngOnDestroy(): void {
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));
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

     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
     main.style.top = top + 'px';
     
     let newWidth = main.offsetWidth;
     let deltaW =  this.scene.container.w / newWidth;
     //let newHeight = this.scene.container.h * deltaW;
	 let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
	 let deltaH = this.scene.container.h / newHeight;
	 
     this.scene.container.w = newWidth;
     if(newHeight<main.offsetWidth) {
        const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
        newHeight = main.offsetHeight - top;
      //  newWidth = newHeight * this.scene.container.w / this.scene.container.h;
     }
	 this.scene.container.h = newHeight;
     this.scene.banners.forEach((banner)=>{
        if(banner.size) { 
           //banner.size.y = this.fullScreen ? ( banner.size.y + (banner.size.y * deltaH) ) : banner.size.y;
		   banner.size.x /= deltaW;
           banner.size.y /= deltaH;
		   //banner.position.x *= deltaW;
		   banner.position.x /= deltaW;
		   banner.position.y /= deltaH;//= this.fullScreen ? 
        }
     });
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
      const inputs = Array.from(document.querySelectorAll('.input-form'));
      inputs.forEach((input) => {
          input.addEventListener('ionInput', this.onChangeItem);
      });
  }
  
  onSave() {
	  if(this.sceneId) {
	     this.resources.scenes[this.sceneId] = this.scene;
	  }
	  else {
		 this.resources.scenes.push(this.scene);
	  }
		  
      if(this.template === 'fair') {
          this.adminFairsService.update(this.fair)
          .then((response) => {
			  if(!this.sceneId) {
				  this.resources = processData(response.data_fair.resources);
				  this.sceneId = this.resources.scenes.length - 1;
			  }
			  this.goToScene('fair',this.fair.id,this.sceneId);
              this.errors = null;
           })
           .catch(error => {
                this.errors = `Consultando el servicio para actualizar feria ${error}`;
           });
      }
      else if(this.template === 'pavilion') {
          this.adminPavilionsService.update(this.pavilion.id, this.pavilion)
          .then((pavilion) => {
              this.errors = null;
			  if(!this.sceneId) {
				  this.resources = processData(pavilion.resources);
				  this.sceneId = this.resources.scenes.length - 1;
			  }
		      this.goToScene('pavilion',this.pavilion.id,this.sceneId);
           })
           .catch(error => {
                this.errors = `Consultando el servicio para actualizar pabellón ${error}`;
           });
      }
      else if(this.template === 'stand') {
          this.adminStandsService.update(this.stand)
          .then((stand) => {
			  if(!this.sceneId) {
				  this.resources = processData(this.stand.resources);
				  this.sceneId = this.resources.scenes.length - 1;
			  }
		      this.goToScene('stand',this.stand.id,this.sceneId);
              this.errors = null;
           })
           .catch(error => {
                this.errors = `Consultando el servicio para actualizar local comercial ${error}`;
           });
      }
  }
  
  onSaveStand() {
      this.adminFairsService.update(this.fair);
  }
  
  addBanner() {
    const id = new Date().valueOf();
    const banner = {"position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id,"perspective":400, "border":{"style":"none"}};
    this.scene.banners.push(banner);
    
  }
  
  dragEnd(event) {
    const panel = document.querySelector<HTMLElement>('.pane-scene-select');
    this.panelPos.y = ( panel.offsetTop  + event.y ) + 'px';
    this.panelPos.x = ( panel.offsetLeft  + event.x ) + 'px';
  }
  
  dragBannerEnd($event,banner) {
    banner.position.y += $event.y;
    banner.position.x += $event.x;
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
          this.onResize();
          const main = document.querySelector<HTMLElement>('ion-router-outlet');
          let newWidth = main.offsetWidth;
          let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
          this.scene.container.w = newWidth;
          this.scene.container.h = newHeight;
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e:any) => {
        setTimeout(() => {
          this.fullScreen = true;
          this.onResize();
          const main = document.querySelector<HTMLElement>('ion-router-outlet');
          let newWidth = main.offsetWidth;
          let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
          this.scene.container.w = newWidth;
          this.scene.container.h = newHeight;
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
  
  onChangeEffect(effectChange) {
      
      this.bannerSelect.hoverEffects = '';
      this.hoverEffects.forEach((effect)=>{
          if( ( effect.name !== effectChange.name && effect.isChecked ) || ( effect.name === effectChange.name && !effectChange.isChecked ) ) {
             this.bannerSelect.hoverEffects += effect.name + ";";
          }
      });
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
             
             this.fair.resources = this.fair.resources.scenes.filter((scene,key)=>{
                  return key != sceneId;
             });
             
             if(this.fair.resources.scenes.length == 0) {
                const main = document.querySelector<HTMLElement>('ion-router-outlet');
                const scene = { 'url_image': 'https://dummyimage.com/1092x768/EFEFEF/000.png', 'banners': [], 'container':  { 'w': main.offsetWidth, 'h': main.offsetHeight } };
                this.fair.resources.scenes.push(scene);
             }
             
          }
        }
      ]
    });
    await alert.present();
  }
  
  defaultEscene(resources) {
      const main = document.querySelector<HTMLElement>('ion-router-outlet');
      resources.scenes = resources.scenes || [];
      return { 'url_image': 'https://dummyimage.com/1092x768/EFEFEF/000.png', 'banners': [], 'container':  { 'w': main.offsetWidth, 'h': main.offsetHeight },
               'show': true,'menuIcon':'map-outline', 'title': 'Escena #' + (resources.scenes.length + 1) };
	  
  }
  
  goToScene(template, objId, sceneId) {
    this.router.navigateByUrl(`/super-admin/map-editor/${template}/${objId}/${sceneId}`);
  }
  
  
}



