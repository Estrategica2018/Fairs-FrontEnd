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
  showSearchbar: any;

  constructor(
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
    private pavilionsService: PavilionsService
  ) {
    this.initializeApp();
    this.initializeFair();
  }
  
  initializeFair() {
      this.fairsService.getCurrentFair().
      then( fair => {
        this.fair = fair;
        
      }, errors => {
          
      });
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    this.listenForFullScreenEvents();
    
    
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
	  this.showPavilionDetail =  this.showPavilionDetail === 'pavilion_id_'+pavilion.id ?  null : 'pavilion_id_'+pavilion.id
	  
	  this.router.navigateByUrl(`/app/tabs/maps/pavilion${index}/${pavilion.id}`,{
			skipLocationChange: true
		});
  }

  
}

