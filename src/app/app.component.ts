import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { UsersService } from './api/users.service';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { LoadingService } from './providers/loading.service';
import { FairsService } from './api/fairs.service';
import { PavilionsService } from './api/pavilions.service';
import { AlertController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  
  title = 'angulartitle';
  loggedIn = false;
  dark = false;
  errors: string = null;
  fair: any;
  fullScreen = false;
  showPavilionDetail: string = null;
  showStandDetail: string = null;
  _toolbarHeight = 56;
  profileRole:any;
  
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
    private pavilionsService: PavilionsService,
    private titleService: Title,
	private menuCtrl: MenuController
  ) {
    this.initializeApp();
    this.initializeFair();
  }
  
  initializeFair() {
      this.fairsService.getCurrentFair().
      then( fair => {
        this.fair = fair;
        this.titleService.setTitle(this.fair.description);
      },error=> console.log(error));
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    this.listenForFullScreenEvents();
    this._toolbarHeight = document.querySelector('ion-toolbar').offsetHeight;
    
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
    setTimeout(() => {
      this.loggedIn = user !== null;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', (user) => {
      this.updateLoggedInStatus(user);
    }); 
    
    window.addEventListener('user:signup', (user) => {
      setTimeout(() => {
        this.loggedIn = user !== null;
      }, 300);
    }); 

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(null);
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
              this.router.navigateByUrl(`/app/tabs/schedule`);
            });
            
          },
          error => {
            this.loading.dismiss();
            this.errors = error;
         }
        ); 
    });

  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl(`/tutorial`);
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
  
}
