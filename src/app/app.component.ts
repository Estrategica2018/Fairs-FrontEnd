import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { UsersService } from './api/users.service';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { LoadingService } from './providers/loading.service';

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
	private loading: LoadingService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
	
    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
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

  logout() {
	this.loading.present({message:'Cargando...'});
	this.usersService.getUser().then(userDataSession=>{
		this.usersService.logout(userDataSession)
		.subscribe(
		  data => {
			this.loading.dismiss();
			
			this.usersService.setUser(null).then(() => {
			  window.dispatchEvent(new CustomEvent('user:logout'));
			  this.router.navigateByUrl('/app/tabs/schedule');
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
    this.router.navigateByUrl('/tutorial');
  }
  
  onChangeDarkModel() {
	window.dispatchEvent(new CustomEvent('dark:change', { detail: this.dark } ));
  }
  
}
