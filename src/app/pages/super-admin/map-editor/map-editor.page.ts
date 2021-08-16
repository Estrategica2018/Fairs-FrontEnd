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
  success = null;
  fixedBannerPanel = true;
  
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
  showToolPanel = false;
  showSceneTools = false;
  showToolItemPanel = false;
  bannerSelectHover = null;
  isHover = null;
  hoverEffects = [ {"name":"GirarDerecha","isChecked":false},{"name":"GirarIzquierda","isChecked":false}];
  @ViewChild('inputWidth', { static: true }) inputWidth: ElementRef;
  borderStyles = ["none","dotted","dashed","solid","double","groove","ridge","inset","outset","hidden"];
  toolTipArrowStyles = [{"label":"Arrow Up","value":"arrow--1"},{"label":"Array left","value":"arrow--2"},{"label":"Arrow Down","value":"arrow--3"},{"label":"Arrow Rigth","value":"arrow--4"},
                        {"label":"Arrow Up Inside","value":"arrow--5"},{"label":"Array left Inside","value":"arrow--6"},{"label":"Arrow Down Inside","value":"arrow--7"},{"label":"Arrow Rigth Inside","value":"arrow--8"}];
  fontFamilyList = [
    {'label':'Gill Sans Extrabold', 'value':'"Gill Sans Extrabold", Helvetica, sans-serif'},
    {'label':'Lucida Console', 'value': 'Courier, "Lucida Console", monospace'},
    {'label':'YoutubeSansMedium', 'value': 'YoutubeSansMedium'},
    {'label':'YoutubeSansBold', 'value': 'YoutubeSansBold'},
    {'label':'YoutubeSansLight', 'value': 'YoutubeSansLight'},
    {'label':'Sans-Serif Arial', 'value': '"Sans-Serif", Arial, sans-serif'},
    {'label':'Sans-Serif Helvetica', 'value': '"Sans-Serif", Helvetica, sans-serif'},
    {'label':'Times New Roman', 'value': '"Times New Roman", Times, serif'},
    {'label':'Arial', 'value': 'Arial, sans-serif'},
    {'label':'Brush Script MT', 'value': '"Brush Script MT", cursive'},
    {'label':'Georgia', 'value': 'Georgia, serif'},
    {'label':'Gill Sans', 'value': '"Gill Sans", serif'},
    {'label':'Helvetica Narrow', 'value': '"Helvetica Narrow", sans-serif'}
  ];
  
  internalUrlList: any;
  showItemPanel = false;
  
  
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
      this.initializePanel();
  }

  ngOnInit() {
     //this.initializeScreen();
  }
  
  onToogleItem() {
    
    
    
  }
  
  ngAfterViewInit() {
     this.initializeScreen();
  }

   
   initializeScreen() {
     this.bannerSelect = null; 
     this.loading.present({message:'Cargando...'});
     this.template = this.route.snapshot.paramMap.get('template');
     this.objId = this.route.snapshot.paramMap.get('objId');
     this.sceneId = this.route.snapshot.paramMap.get('sceneId');
     
     const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
     const main = document.querySelector<HTMLElement>('ion-router-outlet');

     main.style.top = top + 'px';
     
     
     const btnSave = document.querySelector<HTMLElement>('.panel-scene-save');
     const panelPosX = ( main.offsetWidth - btnSave.offsetWidth - 600 ) + 'px';
     this.panelPos = { x: panelPosX + 'px', y: '0px' };
     

     this.fairsService.getCurrentFair().then((fair)=>{
        this.fair = fair;
        this.initializeInternalUrl();
        
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
          
          const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
          const standId = this.route.snapshot.paramMap.get('standId');
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId) {
                this.pavilion = pavilion;
                pavilion.stands.forEach((standEl)=>{
                   if(standEl.id == standId) {
                      this.stand = standEl;
                      this.resources = this.stand.resources;
                      this.scene = this.sceneId ? this.stand.resources.scenes[this.sceneId] : this.defaultEscene(this.resources);
                   }
                });
              }
          });
        }
        
        this.scene.banners = this.scene.banners || [];
        this.loading.dismiss();
        this.onResize();  
        const div = document.querySelector<HTMLElement>('.div-container');
        div.addEventListener('scroll', this.logScrolling);
        
        
     }, error => {
        this.loading.dismiss();
        console.log(error);     
        this.errors = `Consultando el servicio del mapa general de la feria`;
     });
     

  }
  
 // ngOnDestroy(): void {
 //    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
 // }
  
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

     if(!this.scene.container) return;
     
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     const top = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
     main.style.top = top + 'px';
     
     let newWidth = main.offsetWidth;
     let deltaW =  this.scene.container.w / newWidth;
     let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
     let deltaH = this.scene.container.h / newHeight;
     
     if(newHeight < main.offsetHeight) {
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
      this.bannerSelect.hoverEffects = this.bannerSelect.hoverEffects || '';
      this.hoverEffects.forEach((effect)=>{
         effect.isChecked = this.bannerSelect.hoverEffects.includes(effect.name);
      });
      this.showToolPanel = false; 
      this.showSceneTools = false;
      this.isHover = bannerSelect.id; 
  }
  
  onChangeItem() {
      this.editSave = true;
  }
  
  initializePanel() {
      const inputs = Array.from(document.querySelectorAll('.input-form'));
      inputs.forEach((input) => {
          input.addEventListener('ionInput', this.onChangeItem);
      });
  }
  
  onSave() {
      this.loading.present({message:'Cargando...'});
      if(this.sceneId) {
         this.resources.scenes[this.sceneId] = this.scene;
      }
      else {
         this.resources.scenes = this.resources.scenes || [];
         this.resources.scenes.push(this.scene);
      }
      if(this.template === 'fair') {
          this.adminFairsService.update(this.fair)
          .then((response) => {
              this.loading.dismiss();
              this.success= `Escena modificada correctamentes`;
              this.fairsService.refreshCurrentFair();
              if(!this.sceneId) {
                  this.resources = processData(response.data_fair.resources);
                  this.sceneId = this.resources.scenes.length - 1;
                  this.goToScene('fair',this.fair.id,this.sceneId);
              }
              this.ngOnInit();
              this.errors = null;
           })
           .catch(error => {
               this.loading.dismiss();
               this.errors = `Consultando el servicio para actualizar feria ${error}`;
           });
      }
      else if(this.template === 'pavilion') {
          this.adminPavilionsService.update(this.pavilion)
          .then((pavilion) => {
              this.loading.dismiss();
              this.errors = null;
              if(!this.sceneId) {
                  this.resources = processData(pavilion.resources);
                  console.log(pavilion);
                  this.sceneId = this.resources.scenes.length - 1;
              }
              this.fairsService.refreshCurrentFair();
              this.goToScene('pavilion',this.pavilion.id,this.sceneId);
           })
           .catch(error => {
               this.loading.dismiss();
               this.errors = `Consultando el servicio para actualizar pabellón ${error}`;
           });
      }
      else if(this.template === 'stand') {
          this.adminStandsService.update(this.stand)
          .then((stand) => {
              this.loading.dismiss();
              if(!this.sceneId) {
                  this.sceneId = this.resources.scenes.length - 1;
              }
              this.fairsService.refreshCurrentFair();
              this.router.navigateByUrl(`/super-admin/map-editor/stand/${this.pavilion.id}/${this.stand.id}/${this.sceneId}`);
              this.errors = null;
           })
           .catch(error => {
               this.loading.dismiss(); 
               this.errors = `Consultando el servicio para actualizar local comercial ${error}`;
           });
      }
  }
  
  addArrowLineCurve() {
    const id = new Date().valueOf();
    const banner = {"isLine":true, "style": "container-arrow--curve","line":{"weight":"4","type":"dashed"},"fontColor":"#000000","backgroundColor":"#ffff00","position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id};
    this.scene.banners.push(banner);
  }

  addArrowLineRect() {
    const id = new Date().valueOf();
    const banner = {"isLine":true, "style":"container-arrow--rect","line":{"weight":"4","type":"dashed"},"fontColor":"#000000","backgroundColor":"#ffff00","position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id};
    this.scene.banners.push(banner);
  }

  addArrowLineLine() {
    const id = new Date().valueOf();
    const banner = {"isLine":true, "style":"container-arrow--line","line":{"weight":"4","type":"dashed"},"fontColor":"#000000","backgroundColor":"#ffff00","position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id};
    this.scene.banners.push(banner);
  }


  addBanner() {
    const id = new Date().valueOf();
    const banner = {"fontSize":12,"fontColor":"#000000","backgroundColor":"#ffff00","position":{"y":156,"x":195},"rotation":{"x":0,"y":0,"z":0},"size":{"x":114,"y":105},"id":id,"border":{"style":"solid","color":"#000","radius":20,"width":1},
    "toolTipArrow":"arrow--2"};
    this.scene.banners.push(banner);
  }

  addText() {
    const id = new Date().valueOf();
    const banner = {"fontSize":12,"fontColor":"#000000","text":"Texto aquí","position":{"y":256,"x":95},"rotation":{},"size":{"x":100,"y":20},"id":id,"border":{"style":"none","color":"#000","width":1}};
    this.scene.banners.push(banner);
  }

  dragStart(event) {
    
  }
  
  dragPanelSceneSelectEnd(event) {
    const panel = document.querySelector<HTMLElement>('.panel-scene-select');
    this.panelPos.y = ( panel.offsetTop  + event.y ) + 'px';
    this.panelPos.x = ( panel.offsetLeft  + event.x ) + 'px';
  }
  
  dragBannerEnd($event,banner) {
    banner.position.y += $event.y;
    banner.position.x += $event.x;
  }
   
  onDeleteBanner(bannerSelect) {
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
              this.loading.present({message:'Cargando...'});
              this.resources.scenes = this.resources.scenes.filter((scene,key)=>{
                  return key != sceneId;
              });
              
              if(this.template === 'fair') {
                  this.adminFairsService.update(this.fair)
                   .then((response) => {
                       this.loading.dismiss(); 
                       this.fairsService.refreshCurrentFair();
                       this.router.navigateByUrl(`/super-admin/fair`);
                   })
                   .catch(error => {
                       this.loading.dismiss(); 
                       this.errors = `Consultando el servicio para actualizar la feria: ${error}`;
                   });
              }
              else if(this.template === 'pavilion') {
                  this.adminPavilionsService.update(this.pavilion)
                   .then((response) => {
                       this.loading.dismiss(); 
                       this.fairsService.refreshCurrentFair();
                       this.router.navigateByUrl(`/super-admin/fair`);
                   })
                   .catch(error => {
                       this.loading.dismiss(); 
                       this.errors = `Consultando el servicio para actualizar el pabellón: ${error}`;
                   });
               }
               else if(this.template === 'stand') {
                  this.adminFairsService.update(this.fair)
                   .then((response) => {
                       this.loading.dismiss(); 
                       this.fairsService.refreshCurrentFair();
                       this.router.navigateByUrl(`/super-admin/fair`);
                   })
                   .catch(error => {
                       this.loading.dismiss(); 
                       this.errors = `Consultando el servicio para actualizar el pabellón: ${error}`;
                   });
                   this.router.navigateByUrl(`/super-admin/stand/${this.pavilion.id}/${this.stand.id}`);
               }
            
          }
        }
      ]
    });
    await alert.present();
  }
  
  initializeInternalUrl() {
    this.internalUrlList = {'fair':[],'pavilions':[],'stands':[]};
    let scene, pavilion, stand;
    for(let i=0; i<this.fair.resources.scenes.length; i++) {
        scene = this.fair.resources.scenes[i];
        this.internalUrlList.fair.push({'label':'Escena - ' + (i+1), 'value':`/map/fair/${i}`});
    }
    for(let i=0; i<this.fair.pavilions.length; i++) {
        pavilion = this.fair.pavilions[i];
        for(let j=0; j<pavilion.resources.scenes.length; j++) {
            scene = pavilion.resources.scenes[j];
            this.internalUrlList.pavilions.push({'label':'Pabellón '+ pavilion.name + '. Escena - ' + (j+1), 'value':`/map/pavilion1/${pavilion.id}/${j}`});
        }
        for(let j=0; j<pavilion.stands.length; j++) {
            stand = pavilion.stands[j];
            for(let j=0; j<stand.resources.scenes.length; j++) {
                scene = stand.resources.scenes[j];
                this.internalUrlList.stands.push({'label':'Local '+ stand.id + '. Escena - ' + (j+1), 'value':`/map/stand1/${pavilion.id}/${stand.id}/${j}`});
            }
        }
    }
  }
  
  defaultEscene(resources) {
      const main = document.querySelector<HTMLElement>('ion-router-outlet');
      resources.scenes = resources.scenes || [];
      return { 'url_image': 'https://dummyimage.com/1092x768/EFEFEF/000.png', 'banners': [], 'container':  { 'w': 1092, 'h': 768 },
               'show': true,'menuIcon':'map-outline', 'title': 'Escena #' + (resources.scenes.length + 1) };
  }
  
  goToScene(template, objId, sceneId) {
    this.router.navigateByUrl(`/super-admin/map-editor/${template}/${objId}/${sceneId}`);
  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.value == e2.value : e1 == e2;
  }  
  
  onToogleBannerPanel() {
    this.fixedBannerPanel = !this.fixedBannerPanel;
    if(this.fixedBannerPanel) {
       const main = document.querySelector<HTMLElement>('ion-router-outlet');
       const panel = document.querySelector<HTMLElement>('.panel-scene-select');
       this.panelPos.x = ( main.offsetWidth - panel.offsetWidth - 100 ) + 'px';
       this.panelPos.y = '0';
    }
  }
  
  fixedBannerPanelValidator({ x, y }: any): boolean {
    const icon = document.querySelector<HTMLElement>('#fixed-banner-icon');
    return icon.getAttribute('ng-reflect-name') === 'move-outline';
  }



}
