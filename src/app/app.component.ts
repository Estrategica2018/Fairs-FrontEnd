import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { UsersService } from './api/users.service';
import { MenuController, Platform, ToastController, ModalController } from '@ionic/angular';
import { LoadingService } from './providers/loading.service';
import { FairsService } from './api/fairs.service';
import { ShoppingCartsService } from './api/shopping-carts.service';
import { PavilionsService } from './api/pavilions.service';
import { AlertController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart-component/shopping-cart-component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { TermsPage } from './pages/terms/terms.page';
import { AccountComponent } from './pages/account/account.component';
import { AgendasService } from './api/agendas.service';
import { AdminFairsService } from './api/admin/fairs.service';
import { AdminPavilionsService } from './api/admin/pavilions.service';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { environment, SERVER_URL } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  
  loggedIn = false;
  dark = false;
  errors: string = null;
  fair: any;
  fullScreen = false;
  showPavilionDetail: string = null;
  showStandDetail: string = null;
  _toolbarHeight = 56;
  profileRole:any;
  userDataSession: any;
  lTotal = 0;
  url: string;
  
  shoppingCartCount = 0;
  menuHidden = false;
  menuHiddenAnt = 0;
  modal = null;
  showAgenda = false;
  editMenu = false;
  sceneLayoutList = [];
  
  location: Location;
  fairList = [];
  fairAdminMode = false;
  
  constructor(
    private alertCtrl: AlertController,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private usersService: UsersService,
    private toastCtrl: ToastController,
    private loading: LoadingService,
    private fairsService: FairsService,
    private shoppingCartsService: ShoppingCartsService,
    private pavilionsService: PavilionsService,
    private titleService: Title,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private agendasService: AgendasService,
	private adminFairsService: AdminFairsService,
	private adminPavilionsService: AdminPavilionsService,
	private locationComn: Location
  ) {
    this.initializeApp();
    this.initializeFair();
	this.url = window.location.origin;
	this.location = locationComn;
    
  }
  
  initializeFair() {
      this.fairsService.getCurrentFair().
      then( fair => {
        if(fair.name == 'admin') {
		   this.fairAdminMode = true;
           this.usersService.getUser().then((userDataSession: any)=>{
			  this.userDataSession = userDataSession;    
			  
			  this.profileRole = {};
			  if(userDataSession && userDataSession.user_roles_fair) {
				userDataSession.user_roles_fair.forEach((role)=>{
					if(role.id == 1) { //"super_administrador"
					   this.profileRole.admin = true;
					}
				 });
			  }
			  if(!this.fairAdminMode || !this.profileRole.admin) {
				this.presenterLogin();
			  }
			  else {
				this.redirectTo('/admin');
			  }
			  
			});
		}
		else {
		  this.fair = fair;
          this.getShoppingCart();
          this.titleService.setTitle(this.fair.description);
        
		  this.initializeSceneMenu();
		
          this.agendasService.list()
          .then((data) => {
              this.showAgenda = data.length > 0;
           }, error => {
              this.showAgenda = false;
           });
        }
      },(e: any)=> console.log(e));
  }
  
  initializeSceneMenu(){
	 this.lTotal = 0;
     this.sceneLayoutList = [];
	 this.fair.resources = this.fair.resources || { 'scenes': [] };
	 this.fair.pavilions =  this.fair.pavilions || [];
	 
	 /*for(let scene of this.fair.resources.scenes) {
		 if(scene.show || (this.editMenu && this.profileRole && this.profileRole.admin)) {
             this.lTotal++;
		 }
	 }*/
	 for(let scene of this.fair.resources.scenes) this.lTotal++;
	 for(let pav of this.fair.pavilions) this.lTotal++;
	 
	 //this.fair.location = [];
	 
	 function findScenePosition(fair,type,iScene,indx) {
		
		if( typeof fair.location == 'string' ) {
		  if(fair.location == '{}') { fair.location = '[]'; }
		  fair.location = JSON.parse(fair.location);
		}
		
		fair.location = fair.location && fair.location.length > 0 ? fair.location : [];
		
		for(let i=0,location = null; i<fair.location.length;i++){
			location = fair.location[i];
			if(location.type == type && location.iScene == iScene) {
				return location.menuPosition;
			}
		}
		
		fair.location.push({'type': type,'iScene': iScene,'menuPosition': indx});
		return indx;
	 }
	 
	 for(let i=0; i<this.lTotal; i++){
		
		let mbControl = false;
		
		for(let iScene = 0, scene = null; iScene < this.fair.resources.scenes.length; iScene ++) {
			scene = this.fair.resources.scenes[iScene];
			//if(!scene.show || (this.editMenu && this.profileRole && this.profileRole.admin)) continue;
			scene.menuPosition = findScenePosition(this.fair,'sceneFair',iScene,(i+1));
			scene.id = scene.id || this._getId();
			if(scene.menuPosition == i + 1) {
				this.sceneLayoutList.push({'type':'sceneFair', 'scene': scene, 'iScene': iScene});
				mbControl = true;
				break;
			}
		}
		
		if(!mbControl) {
		
		  for(let iScene = 0, pavilion = null; iScene < this.fair.pavilions.length; iScene ++) {
			pavilion = this.fair.pavilions[iScene];
			pavilion.menuPosition = findScenePosition(this.fair,'scenePavilion',iScene,(i+1));
			if(pavilion.menuPosition == i + 1) {
			  this.sceneLayoutList.push({'type':'scenePavilion', 'menuPosition': pavilion.menuPosition, 'pavilion': pavilion, 'iScene': iScene});
			  break;
			}
		  }
		}
		
	 }
  }	

  ngOnDestroy(): void {
     if(this.modal) { this.modal.dismiss(); }
  }
  
  ngOnInit() {
    this.checkLoginStatus();
    this.listenForEvents();
    this.listenForFullScreenEvents();
    this._toolbarHeight = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
    
    this.usersService.getUser().then((userDataSession: any)=>{
      this.userDataSession = userDataSession;    
      
      this.profileRole = {};
      if(userDataSession && userDataSession.user_roles_fair)  {
        userDataSession.user_roles_fair.forEach((role)=>{
            if(role.id == 1) { //"super_administrador"
               this.profileRole.admin = true;
            }
         });
         
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkLoginStatus() {
    return this.usersService.isLoggedIn().then(user => {
      return this.updateLoggedInStatus(user);
    });
  }

  updateLoggedInStatus(user: any) {
    this.loggedIn = ( user !== null );
  }

  listenForEvents() {
    window.addEventListener('user:login', (user) => {
      //this.updateLoggedInStatus(user);
      window.location.reload();
    }); 
	
	window.addEventListener('addScene:menu', (event:any) => {
      this.addSceneMenu(event.detail.type,event.detail.iScene);
    });	
	
	window.addEventListener('removeScene:menu', (event:any) => {
      this.removeSceneMenu(event.detail.type,event.detail.iScene);
    });
    
    window.addEventListener('user:signup', (user) => {
      setTimeout(() => {
        //this.loggedIn = user !== null;
        window.location.reload();
      }, 300);
    }); 

    window.addEventListener('user:logout', () => {
      //this.updateLoggedInStatus(null);
      //this.getShoppingCart();
      //window.location.reload();
	  window.location.href = window.location.host;
    });
    
    window.addEventListener('user:shoppingCart', () => {
      this.getShoppingCart();
    });

    window.addEventListener('open:shoppingCart', () => {
      this.openShoppingCart();
    }); 

  }
  
  listenForFullScreenEvents() {
    window.addEventListener('map:fullscreenOff', (e:any) => {
      setTimeout(() => {
        this.fullScreen = false;
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e:any) => {
      setTimeout(() => {
        this.fullScreen = true;
      }, 300);
    });
  } 

  async presentLogout() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Confirma para cerrar la sesión',
      buttons: [
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: (data: any) => {
             this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    
	this.loading.present({message:'Cargando...'});
	
    this.usersService.getUser().then(userDataSession=>{
        this.usersService.logout(userDataSession)
        .subscribe(
          data => {
            this.loading.dismiss();
            
			window.location.href = window.location.host;
			window.location.reload();
			
            this.usersService.setUser(null).then(() => {
              this.router.navigateByUrl(`/map/fair/0`);
            });
            
          },
          error => {
            this.loading.dismiss();
            this.errors = error;
            this.usersService.setUser(null).then(() => {
              window.dispatchEvent(new CustomEvent('user:logout'));
              //this.router.navigateByUrl(`/schedule`);
            });
         }
        ); 
    });

  }

  openTutorial() {
    //this.menu.enable(false);
    this.storage.set('ion_did_tutorial', true);
    //this.router.navigateByUrl(`/tutorial`);
  }
  
  onChangeDarkModel() {
    window.dispatchEvent(new CustomEvent('dark:change', { detail: this.dark } ));
  }
  
  onPavilionClick(pavilion,index) {
      this.showStandDetail = null;
      this.showPavilionDetail =  this.showPavilionDetail === 'pavilion_id_' + pavilion.id ?  null : 'pavilion_id_' + pavilion.id
      
      this.router.navigateByUrl(`/maps/pavilion${index}/${pavilion.id}`,{
            skipLocationChange: true
        });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }

  onClickFairScene(sceneId) {
    this.showPavilionDetail = null
    this.redirectTo('/map/fair/'+sceneId);
  }

  onClickPavilion(pavilion) {
    this.showStandDetail = null;
    pavilion.showStandDetail = null;
    this.showPavilionDetail =  this.showPavilionDetail === 'pavilion_id_'+pavilion.id ?  null : 'pavilion_id_'+pavilion.id
    this.redirectTo('/map/pavilion/'+pavilion.id+'/0');
  }
  
  onClickPavilionScene(pavilion,index) {
      this.redirectTo('/map/pavilion/'+pavilion.id+'/'+index);
  }
  
  async onClickPavilionLocal(pavilion){
      if(pavilion)
       pavilion.showStandDetail =  pavilion.showStandDetail ==='pavilion_id_'+pavilion.id ? null : 'pavilion_id_'+pavilion.id;
       await this.menuCtrl.open('end');
  }
  
  onClickPavilionStand(pavilion,stand) {
    stand.standShowSelect = stand.standShowSelect ? false : true;
    this.redirectTo('/map/stand/'+pavilion.id+'/'+stand.id+'/0');
  }
  
  onClickPavilionStandScene(pavilion,stand,index){
      this.redirectTo('/map/stand/'+pavilion.id+'/'+stand.id+'/'+index);
  }
  
  getShoppingCart() {
      //this.loading.present({message:'Cargando...'});
      this.usersService.getUser().then((userDataSession)=>{ 
          this.shoppingCartsService.list(this.fair, userDataSession)
          .then( response => {
            this.shoppingCartCount = response.length;
            //this.loading.dismiss();
          }, errors => {
              this.errors = errors;
              //this.loading.dismiss();
          })
         .catch(error => {
            this.errors = error; 
			console.log(error);
            //this.loading.dismiss();
         }); 
      });
  }
  
  async openShoppingCart() {

    if(this.modal) { this.modal.dismiss(); }
  
    this.modal = await this.modalCtrl.create({
      component: ShoppingCartComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
          'fair': this.fair,
          'type': 'Agenda',
          '_continue': false
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  } 

  onHidenMenu() {
    this.menuHiddenAnt = 0;
    this.menuHidden = true;
    window.dispatchEvent(new CustomEvent('window:resize'));
  }
  
  onShowMenu() {
    this.menuHidden = false;
    window.dispatchEvent(new CustomEvent('window:resize'));
  } 
  
  onMenuOver() {
   if(this.menuHiddenAnt > 0 ) {
      window.dispatchEvent(new CustomEvent('window:resize'));
   }
   else {
    setTimeout(()=>{
        this.menuHiddenAnt ++;
    },400);
   }
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

    if(data) {
    }
  } 
  
  async presentSignup() {
    
    //if(this.modal) { this.modal.dismiss(); }
    
    this.modal = await this.modalCtrl.create({
      component: SignupComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_patern': this
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  } 

  async presentTermsModal() {
    const modal = await this.modalCtrl.create({
      component: TermsPage,
      swipeToClose: true,
      //presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }

  async presentAccount() {
    
    this.modal = await this.modalCtrl.create({
      component: AccountComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_patern': this
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  }   

  goToSceneUp(sceneLayout, menuPosition, obj) {
	if(menuPosition == 0 || !obj || !obj.resources || !obj.resources.scenes) return;
  
    let list = [];
	this.fair.location = [];
	let mp0: Number = menuPosition;
	let mp1: Number;
	let sceneIni = sceneLayout.scene ? sceneLayout.scene : sceneLayout.pavilion;
	
    for(let i = 0, sceneTmp = null, sceneNext = null; i < this.sceneLayoutList.length; i++) {
		sceneTmp = this.sceneLayoutList[i].scene ? this.sceneLayoutList[i].scene : this.sceneLayoutList[i].pavilion;
		if((menuPosition - 1) == i + 1 ) {
			sceneNext = this.sceneLayoutList[i + 1].scene ? this.sceneLayoutList[i + 1 ].scene : this.sceneLayoutList[i + 1].pavilion;
			mp1 = sceneNext.menuPosition;
			sceneNext.menuPosition = mp0;
			sceneIni.menuPosition = mp1;
			this.addEditedScene(list, this.sceneLayoutList[i+1], i );
			this.addEditedScene(list, this.sceneLayoutList[i], i + 1 );
		} else if (menuPosition == i + 1){
			
		}
		else {
			this.addEditedScene(list, this.sceneLayoutList[i], i);
		}
	}
	this.sceneLayoutList = list;
  }
  
  goToSceneDown(sceneLayout, menuPosition, obj) {
	if( menuPosition + 1 > this.lTotal || !obj || !obj.resources || !obj.resources.scenes) return;
	let list = [];
	this.fair.location = [];
	let mp0: Number = menuPosition;
	let mp1: Number;
	let sceneIni = sceneLayout.scene ? sceneLayout.scene : sceneLayout.pavilion;
	
    for(let i = 0, sceneTmp = null, sceneNext = null; i < this.sceneLayoutList.length; i++) {
		sceneTmp = this.sceneLayoutList[i].scene ? this.sceneLayoutList[i].scene : this.sceneLayoutList[i].pavilion;
		if(menuPosition == i + 1 ) {
			sceneNext = this.sceneLayoutList[i + 1].scene ? this.sceneLayoutList[i + 1].scene : this.sceneLayoutList[i + 1].pavilion;
			mp1 = sceneNext.menuPosition;
			sceneNext.menuPosition = mp0;
			sceneIni.menuPosition = mp1;
			this.addEditedScene(list, this.sceneLayoutList[i+1], i );
			this.addEditedScene(list, this.sceneLayoutList[i], i + 1 );
			
			
		} else if (menuPosition == sceneTmp.menuPosition){
			
		}
		else {
			this.addEditedScene(list, this.sceneLayoutList[i], i);
		}
	}
	this.sceneLayoutList = list;
  }

  addEditedScene(list, sceneLayout, indx) {
	  const scene = sceneLayout.scene ? sceneLayout.scene : sceneLayout.pavilion;
	  const type = sceneLayout.scene ? 'sceneFair' : 'scenePavilion';
	  this.editMenu = true;
	  
	  if(type == 'sceneFair') {
	     list.push({'scene': scene,'type': type, 'iScene': sceneLayout.iScene });
	  }
	  if(type == 'scenePavilion') {
	     list.push({'pavilion': scene,'type': type, 'iScene': sceneLayout.iScene });
	  }
	  
	  this.fair.location.push({'type': type,'iScene': sceneLayout.iScene,'menuPosition': indx + 1});
  }
  

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
    });  
    toast.present();
  }
  
  updateSceneMenu(isExternal) {
	if(!isExternal)  this.loading.present({message:'Cargando...'});
	
	  const fair  = Object.assign({},{'id':this.fair.id,'location': JSON.stringify(this.fair.location)});
	  this.adminFairsService.updateFair(fair)
	  .then((response) => {
		  this.editMenu = false;
		  if(!isExternal) { 
		    this.presentToast(`Menú guardado con exito`);
		    this.loading.dismiss();
		  }
		  else {
			  
			  if(isExternal.typeAction == 'add' && isExternal.type=='sceneFair') {
			    window.location.replace(`${this.url}/Fair-website/#/super-admin/map-editor/fair/${isExternal.sceneId}`);
			  }
			  else if(isExternal.typeAction == 'remove' && isExternal.type=='sceneFair') {
				  window.location.replace(`${this.url}/Fair-website/#/super-admin/fair`);
			  } 
			  else if(isExternal.typeAction == 'add' && isExternal.type=='scenePavilion') {
			    window.location.replace(`${this.url}/Fair-website/#/super-admin/pavilion/${isExternal.sceneId}`);
			  }			  
			  else if(isExternal.typeAction == 'remove' && isExternal.type=='scenePavilion') {
				window.location.replace(`${this.url}/Fair-website/#/super-admin/fair`);
			  }
		  }
	  })
	  .catch(error => {
		   this.loading.dismiss();
		   console.log(error);
		   this.presentToast(`Consultando el servicio para actualizar menú ${error}`);
	  });
  }
  
  _getId() {
	  return new Date().valueOf() + Math.floor(Math.random() * 1000);
  }
  
  addSceneMenu(type,iScene) {
	  var list = [];
	  var indx = 1;
	  list.push({'type': type,'iScene': iScene,'menuPosition': indx});
	  for(let location of this.fair.location) {
		location.menuPosition ++;
		list.push(location);
	  }
	  
	  this.fair.location = list;
	  this.updateSceneMenu({'type': type, 'sceneId': iScene, 'typeAction' : 'add' });
  }
  
  removeSceneMenu(type,iScene) {
	  var list = [];
	  var indxRem = 10000;
	  console.log('antes',this.fair.location)
	  for(let location of this.fair.location) {
		if(location.type == type && location.iScene == iScene) {
			indxRem = location.menuPosition;
		}
		else if(location.menuPosition > indxRem ) {
		    location.menuPosition --;
			list.push(location);
		}
		else {
			list.push(location);
		}
	  }
	  
	  this.fair.location = list;
	  console.log('despues',this.fair.location)
	  this.updateSceneMenu({'type': type, 'sceneId': iScene, 'typeAction' : 'remove'});
  }


  onEditMenuClick(){
    this.initializeSceneMenu(); 
	this.editMenu=true
  }
  
  onCancelEditMenuClick() {
     this.editMenu = false;
  }

}
