import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
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
  
  shoppingCartCount = 0;
  menuHidden = false;
  menuHiddenAnt = 0;
  modal = null;
  showAgenda = false;
  
  constructor(
    private alertCtrl: AlertController,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private usersService: UsersService,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private loading: LoadingService,
    private fairsService: FairsService,
    private shoppingCartsService: ShoppingCartsService,
    private pavilionsService: PavilionsService,
    private titleService: Title,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
	private agendasService: AgendasService
  ) {
    this.initializeApp();
    this.initializeFair();
    
  }
  
  initializeFair() {
      this.fairsService.getCurrentFair().
      then( fair => {
        this.fair = fair;
        this.getShoppingCart();
        this.titleService.setTitle(this.fair.description);
		
		this.agendasService.list()
        .then((data) => {
			this.showAgenda = data.length > 0;
         }, error => {
            this.showAgenda = false;
         });
		
      },(e: any)=> console.log(e));
  }

  ngOnDestroy(): void {
     if(this.modal) { this.modal.dismiss(); }
  }
  
  ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
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

  listenForLoginEvents() {
    window.addEventListener('user:login', (user) => {
      //this.updateLoggedInStatus(user);
      window.location.reload();
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
      window.location.reload();
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
            
            this.usersService.setUser(null).then(() => {
              window.dispatchEvent(new CustomEvent('user:logout'));
              this.router.navigateByUrl(`/schedule`);
            });
            
          },
          error => {
            this.loading.dismiss();
            this.errors = error;
            this.usersService.setUser(null).then(() => {
              window.dispatchEvent(new CustomEvent('user:logout'));
              this.router.navigateByUrl(`/schedule`);
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

  onClickFairScene(scene) {
    this.showPavilionDetail = null
    this.redirectTo('/map/fair/'+scene);
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
      this.loading.present({message:'Cargando...'});
      this.usersService.getUser().then((userDataSession)=>{ 
          this.shoppingCartsService.list(this.fair, userDataSession)
          .then( response => {
            this.shoppingCartCount = response.length;
            this.loading.dismiss();
          }, errors => {
              this.errors = errors;
              this.loading.dismiss();
          })
         .catch(error => {
            this.errors = error; 
            this.loading.dismiss();
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
  
}
