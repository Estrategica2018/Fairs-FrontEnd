import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UsersService } from './api/users.service';
import { MenuController, Platform, ToastController, ModalController, AnimationController } from '@ionic/angular';
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
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
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
  profileRole: any = { admin: false };
  userDataSession: any;
  lTotal = 0;
  url: string;
  showBannerSideMenu = false;

  shoppingCartCount = 0;
  menuHidden = false;
  menuHiddenAnt = 0;
  modal = null;
  showAgenda = false;
  editMenu = false;
  sceneLayoutList = [];
  agendaLive: any;

  location: Location;
  fairList = [];
  fairAdminMode = false;
  menuHover: string = null;
  miniMenu: any = {};
  menuChangeList = [];
  mobileApp = false;
  imageUrlLiveBoton: string;
  liveUrlBotton: string;
  intervalVideo = {};

  constructor(
    private alertCtrl: AlertController,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
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
    private locationComn: Location,
    private animationCtrl: AnimationController,
  ) {

    this.initializeFair();
    this.listenForLoginEvents();
    this.listenForFullScreenEvents();

    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      this.mobileApp = true;
    }
    else if (navigator.userAgent.indexOf('Mobile') > 0) {
      this.mobileApp = true;
    }

    this.url = document.baseURI;
    this.location = locationComn;
    this.onHidenMenu();
  }

  initializeFair() {
    this.fairsService.getCurrentFair().
      then(fair => {

        this.fair = fair;
        this.fair.resources = this.fair.resources || {};
        this.fair.resources.liveBottonHover = 'https://res.cloudinary.com/deueufyac/image/upload/v1668741080/CONGRESO%20NACIONAL%20DE%20BIBLIOTECAS/trans_b_qnwhwl.png';
        this.fair.resources.liveBotton = 'https://res.cloudinary.com/deueufyac/image/upload/v1668741080/CONGRESO%20NACIONAL%20DE%20BIBLIOTECAS/trans_live_haphdg.png';

        this.fair.resources.hasShoppingCart = false;

        if (fair.name == 'admin') {
          this.fairAdminMode = true;
          this.usersService.getUser().then((userDataSession: any) => {
            this.userDataSession = userDataSession;

            this.profileRole = {};
            if (userDataSession && userDataSession.user_roles_fair) {
              userDataSession.user_roles_fair.forEach((role) => {
                if (role.id == 1) { //"super_administrador"
                  this.profileRole.admin = true;
                }
              });
            }
            if (!this.fairAdminMode || !this.profileRole.admin) {
              this.presenterLogin({});
            }
            else {
              this.redirectTo('/admin');
            }

          });
        }
        else {

          if (this.fair && this.fair.resources.hasShoppingCart) {
            this.getShoppingCart();
          }
          this.titleService.setTitle(this.fair.description);

          this.initializeSceneMenu();

          this.agendasService.list(this.fairAdminMode)
            .then((data) => {
              this.showAgenda = data.length > 0;
            }, error => {
              this.showAgenda = false;
            });
        }

        this.initializeLiveActionBotton(false);
        setInterval(() => {
          this.initializeLiveActionBotton(false);
        }, 60000);

      }, (e: any) => console.log(e));
  }

  initializeLiveActionBotton(live) {

    this.agendasService.live().then((response) => {

      if (response && response.data && this.fair.resources.liveBotton) {
        this.imageUrlLiveBoton = this.fair.resources.liveBotton;
        this.agendaLive = response.data;

        this.animationLiveInterval();

        if (live && live.id == this.agendaLive.id) {
          this.goToLive(this.agendaLive);
        }
      }
      else {
        this.agendaLive = null;
      }
    }, errors => {
      this.errors = errors;
      //this.loading.dismiss();
    })
      .catch(error => {
        this.errors = error;
        console.log(error);
        //this.loading.dismiss();
      });
  }

  initializeSceneMenu() {

    this.lTotal = 0;
    this.sceneLayoutList = [];
    this.fair.resources = this.fair.resources || { 'scenes': [] };
    this.fair.pavilions = this.fair.pavilions || [];

    /*for(let scene of this.fair.resources.scenes) {
        if(scene.show || (this.editMenu && this.profileRole && this.profileRole.admin)) {
            this.lTotal++;
        }
    }*/
    for (let scene of this.fair.resources.scenes) this.lTotal++;
    for (let pav of this.fair.pavilions) this.lTotal++;

    //this.fair.location = [];

    function findScenePosition(fair, type, iScene, indx) {

      if (typeof fair.location == 'string') {
        if (fair.location == '{}') { fair.location = '[]'; }
        fair.location = JSON.parse(fair.location);
      }

      fair.location = fair.location && fair.location.length > 0 ? fair.location : [];

      for (let i = 0, location = null; i < fair.location.length; i++) {
        location = fair.location[i];
        if (location.type == type && location.iScene == iScene) {
          return location.menuPosition;
        }
      }

      fair.location.push({ 'type': type, 'iScene': iScene, 'menuPosition': indx });
      return indx;
    }


    for (let i = 0; i < this.lTotal; i++) {

      let mbControl = false;

      for (let iScene = 0, scene = null; iScene < this.fair.resources.scenes.length; iScene++) {
        scene = this.fair.resources.scenes[iScene];

        //if(!scene.show || (this.editMenu && this.profileRole && this.profileRole.admin)) continue;
        scene.menuPosition = findScenePosition(this.fair, 'sceneFair', iScene, (i + 1));
        scene.id = scene.id || this._getId();
        if (scene.menuPosition == i + 1) {
          this.sceneLayoutList.push({ 'type': 'sceneFair', 'scene': scene, 'iScene': iScene });
          mbControl = true;
          break;
        }
      }

      if (!mbControl) {

        for (let iScene = 0, pavilion = null; iScene < this.fair.pavilions.length; iScene++) {
          pavilion = this.fair.pavilions[iScene];
          pavilion.menuPosition = findScenePosition(this.fair, 'scenePavilion', iScene, (i + 1));
          if (pavilion.menuPosition == i + 1) {

            this.sceneLayoutList.push({ 'type': 'scenePavilion', 'menuPosition': pavilion.menuPosition, 'pavilion': pavilion, 'iScene': iScene });
            break;
          }
        }
      }

      this.initializeToopTipMenu();
    }
  }

  menuRestart() {

    this.lTotal = 0;
    this.sceneLayoutList = [];
    this.fair.resources = this.fair.resources || { 'scenes': [] };
    this.fair.pavilions = this.fair.pavilions || [];
    this.fair.location = [];

    for (let iScene = 0, scene = null; iScene < this.fair.resources.scenes.length; iScene++) {
      scene = this.fair.resources.scenes[iScene];
      this.lTotal++;
      scene.menuPosition = this.lTotal;
      scene.id = scene.id || this._getId();

      this.sceneLayoutList.push({ 'scene': scene, 'type': 'sceneFair', 'iScene': iScene });
      this.fair.location.push({ 'type': 'sceneFair', 'iScene': iScene, 'menuPosition': this.lTotal });
    }

    for (let iScene = 0, pavilion = null; iScene < this.fair.pavilions.length; iScene++) {

      pavilion = this.fair.pavilions[iScene];
      this.lTotal++;

      pavilion.menuPosition = this.lTotal;

      this.sceneLayoutList.push({ 'pavilion': pavilion, 'type': 'scenePavilion', 'iScene': iScene });
      this.fair.location.push({ 'type': 'scenePavilion', 'iScene': iScene, 'menuPosition': this.lTotal });
    }

    ////this.initializeToopTipMenu();
    this.menuChangeList = [];
    this.menuChangeList.push({ 'type': 'Fair' });
  }

  ngOnDestroy(): void {
    if (this.modal) { this.modal.dismiss(); }
  }

  ngOnInit() {
    this.checkLoginStatus();

    this._toolbarHeight = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;

    this.usersService.getUser().then((userDataSession: any) => {
      this.userDataSession = userDataSession;

      this.profileRole = {};
      if (userDataSession && userDataSession.user_roles_fair) {
        userDataSession.user_roles_fair.forEach((role) => {
          if (role.id == 1) { //"super_administrador"
            this.profileRole.admin = true;
          }
        });

      }
    });
  }

  checkLoginStatus() {
    return this.usersService.isLoggedIn().then(user => {
      return this.loggedIn = (user !== null);
    });
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', (data: any) => {
      //window.location.reload();
      this.userDataSession = data.detail.userDataSession;

      if (data.detail.liveStream) {
        this.goToLive(data.detail.liveStream);
      }
      if (data.detail.modalCtrl) {
        data.detail.modalCtrl.dismiss();
      }
      this.ngOnInit();
      if (data.detail.showRegister) {
        setTimeout(() => {
          this.redirectTo('/form-mincultura-catalog');
        }, 500);
      }
      if (data.detail.reload) {
        window.location.reload();
      }
    });


    window.addEventListener('user:liveStream', (data) => {
      this.goToLive(this.agendaLive);
    });

    window.addEventListener('set:intervalVideo', (data: any) => {
      console.log('set:intervalVideo');
      this.intervalVideo = data.detail.intervalVideo;
    });

    window.addEventListener('clear:intervalVideo', () => {
      console.log('clear:intervalVideo');
      for (const indx in this.intervalVideo) {
        const interval = this.intervalVideo[indx].interval;
        if (interval) {
          console.log('clear interval' + interval);
          clearInterval(interval);
        }
        /*const playVideo = this.intervalVideo[indx].playVideo;
        playVideo.pause().then(function (paused) {
          console.log('video pausado automaticamente ');
        });*/
      }
    });


    window.addEventListener('addScene:menu', (event: any) => {
      //this.addSceneMenu(event.detail.type, event.detail.iScene);
    });

    window.addEventListener('removeScene:menu', (event: any) => {
      //this.removeSceneMenu(event.detail.type, event.detail.iScene);
    });


    window.addEventListener('user:logout', () => {
      //this.updateLoggedInStatus(null);
      //this.getShoppingCart();
      //window.location.reload();
      //window.location.href = window.location.host;
      window.location.href = window.origin;
    });

    window.addEventListener('user:shoppingCart', () => {
      this.getShoppingCart();
    });

    window.addEventListener('open:shoppingCart', () => {
      this.openShoppingCart();
    });
  }

  listenForFullScreenEvents() {
    window.addEventListener('map:fullscreenOff', (e: any) => {
      setTimeout(() => {
        this.fullScreen = false;
      }, 300);
    });

    window.addEventListener('map:fullscreenIn', (e: any) => {
      setTimeout(() => {
        this.fullScreen = true;
      }, 300);
    });

    window.addEventListener('banner-side-menu:show', (event: any) => {
      this.showBannerSideMenu = true;
    });

    window.addEventListener('banner-side-menu:hide', (event: any) => {
      this.showBannerSideMenu = false;
    });

  }

  async presentLogout() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Confirma para cerrar la sesión',
      buttons: [
        {
          text: 'Cancelar',
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

    this.loading.present({ message: 'Cargando...' });


    this.usersService.getUser().then(userDataSession => {
      if (userDataSession) {
        this.usersService.logout(userDataSession)
          .subscribe(
            data => {
              this.loading.dismiss();
              this.usersService.setUser(null).then(() => {
                window.dispatchEvent(new CustomEvent('user:logout'));
              });
              window.dispatchEvent(new CustomEvent('user:logout'));

            },
            error => {
              this.loading.dismiss();
              this.errors = error;
              console.log(this.errors);
              this.usersService.setUser(null).then(() => {
                window.dispatchEvent(new CustomEvent('user:logout'));
              });
              window.dispatchEvent(new CustomEvent('user:logout'));
            }
          );
      }
      else {
        this.loading.dismiss();
        console.log('no user data');
        this.usersService.setUser(null).then(() => {
          window.dispatchEvent(new CustomEvent('user:logout'));
        });
        window.dispatchEvent(new CustomEvent('user:logout'));
      }
    });

  }

  openTutorial() {
    //this.menu.enable(false);
    this.storage.set('ion_did_tutorial', true);
    //this.router.navigateByUrl(`/tutorial`);
  }

  onChangeDarkModel() {
    window.dispatchEvent(new CustomEvent('dark:change', { detail: this.dark }));
  }

  onPavilionClick(pavilion, index) {
    this.showStandDetail = null;
    this.showPavilionDetail = this.showPavilionDetail === 'pavilion_id_' + pavilion.id ? null : 'pavilion_id_' + pavilion.id

    this.router.navigateByUrl(`/maps/pavilion${index}/${pavilion.id}`, {
      skipLocationChange: true
    });
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  onClickFairScene(sceneLayout) {
    this.showPavilionDetail = null;
    if (sceneLayout.scene.rows) {
      this.redirectTo('/map-site/fair/' + sceneLayout.iScene);
    }
    else {
      this.redirectTo('/map/fair/' + sceneLayout.iScene);
    }
  }

  onClickPavilion(pavilion) {
    this.showStandDetail = null;
    pavilion.showStandDetail = null;
    this.showPavilionDetail = this.showPavilionDetail === 'pavilion_id_' + pavilion.id ? null : 'pavilion_id_' + pavilion.id
    this.redirectTo('/map/pavilion/' + pavilion.id + '/0');
  }

  onClickPavilionScene(pavilion, index) {
    this.redirectTo('/map/pavilion/' + pavilion.id + '/' + index);
  }

  async onClickPavilionLocal(pavilion) {
    if (pavilion)
      pavilion.showStandDetail = pavilion.showStandDetail === 'pavilion_id_' + pavilion.id ? null : 'pavilion_id_' + pavilion.id;
    await this.menuCtrl.open('end');
  }

  onClickPavilionStand(pavilion, stand) {
    stand.standShowSelect = stand.standShowSelect ? false : true;
    this.redirectTo('/map/stand/' + pavilion.id + '/' + stand.id + '/0');
  }

  onClickPavilionStandScene(pavilion, stand, index) {
    this.redirectTo('/map/stand/' + pavilion.id + '/' + stand.id + '/' + index);
  }

  getShoppingCart() {
    //this.loading.present({message:'Cargando...'});
    this.usersService.getUser().then((userDataSession) => {
      this.shoppingCartsService.list(this.fair, userDataSession)
        .then(response => {
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

    if (this.modal) { this.modal.dismiss(); }

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

    if (data) {
    }
  }

  onHidenMenu() {
    this.menuHiddenAnt = 0;
    this.menuHidden = true;
    window.dispatchEvent(new CustomEvent('window:resize-menu'));
  }

  onShowMenu() {
    this.menuHidden = false;
    let icon = document.getElementById('mini-menu-forward');
    if (icon)
      this.miniMenu.menuForward = { top: icon.offsetTop, left: icon.offsetLeft };
    window.dispatchEvent(new CustomEvent('window:resize-menu'));
  }

  onMenuOver() {
    if (this.menuHiddenAnt > 0) {
      window.dispatchEvent(new CustomEvent('window:resize'));
    }
    else {
      setTimeout(() => {
        this.menuHiddenAnt++;
      }, 400);
    }
  }

  async presenterLogin(options) {

    //if(this.modal) { this.modal.dismiss(); }

    this.modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this,
        'liveStream': options.liveStream
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if (data) {
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

    if (data) {
    }
  }

  async presentTermsModal() {
    const modal = await this.modalCtrl.create({
      component: TermsPage,
      swipeToClose: true
      //presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }

  async presentAccount() {

    this.redirectTo('/profile');

    /*this.modal = await this.modalCtrl.create({
      component: AccountComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_patern': this
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if (data) {
    }*/
  }

  goToFairSceneUp(event, positionBefore, positionAfter) {
    event.stopPropagation();

    if (!this.fair.location) return;

    let scenesList = [];
    let scenes = this.sceneLayoutList;
    let sceneTemp = null;
    for (let i = scenes.length - 1, scene = null; i >= 0; i--) {
      scene = scenes[i];
      if (i == positionAfter) {
        scenesList.push(sceneTemp);
      }
      else if (i == positionBefore) {
        sceneTemp = scene;
        scenesList.push(scenes[positionAfter]);
      }
      else {
        scenesList.push(scene);
      }
    }

    const scenesListRevert = [];
    this.fair.location = [];
    for (let i = scenesList.length - 1, scene = null; i >= 0; i--) {
      scene = scenesList[i];
      scenesListRevert.push(scene);
    }

    this.sceneLayoutList = scenesListRevert;

    for (let i = 0, scene = null; i < scenesListRevert.length; i++) {
      scene = scenesListRevert[i];
      this.fair.location.push({ "type": scene.type, "iScene": scene.iScene, "menuPosition": i + 1 });
    }

    let mbcontrol = false;
    for (let menuChange of this.menuChangeList) {
      if (menuChange.type == 'Fair') {
        mbcontrol = true;
      }
    }

    if (!mbcontrol) this.menuChangeList.push({ 'type': 'Fair' });
    this.initializeToopTipMenu();
  }

  goToFairSceneDown(event, positionBefore, positionAfter) {
    event.stopPropagation();

    if (!this.fair.location || positionBefore == this.fair.location.length) return;

    let scenesList = [];
    this.fair.location = [];

    const scenes = this.sceneLayoutList;
    let sceneTemp = null;
    for (let i = 0, scene = null; i < scenes.length; i++) {
      scene = scenes[i];
      if (i == positionAfter) {
        scenesList.push(sceneTemp);
      }
      else if (i == positionBefore) {
        sceneTemp = scene;
        scenesList.push(scenes[positionAfter]);
      }
      else {
        scenesList.push(scene);
      }
    }

    this.sceneLayoutList = scenesList;

    for (let i = 0, scene = null; i < scenesList.length; i++) {
      scene = scenesList[i];
      this.fair.location.push({ "type": scene.type, "iScene": scene.iScene, "menuPosition": i + 1 });
    }

    let mbcontrol = false;
    for (let menuChange of this.menuChangeList) {
      if (menuChange.type == 'Fair') {
        mbcontrol = true;
      }
    }

    if (!mbcontrol) this.menuChangeList.push({ 'type': 'Fair' });
    this.initializeToopTipMenu();

  }

  goToPavilionSceneDown(pavilion, positionBefore, positionAfter) {

    if (!pavilion.resources || !pavilion.resources.scenes || positionBefore == pavilion.resources.scenes.length) return;

    let scenesList = [];
    const scenes = pavilion.resources.scenes;
    let sceneTemp = null;
    for (let i = 0, scene = null; i < scenes.length; i++) {
      scene = scenes[i];
      if (i == positionAfter) {
        scenesList.push(sceneTemp);
      }
      else if (i == positionBefore) {
        sceneTemp = scene;
        scenesList.push(scenes[positionAfter]);
      }
      else {
        scenesList.push(scene);
      }
    }
    pavilion.resources.scenes = scenesList;

    let mbcontrol = false;
    for (let menuChange of this.menuChangeList) {
      if (menuChange.type == 'Pavilion' && menuChange.pavilion.id == pavilion.id) {
        mbcontrol = true;
      }
    }

    if (!mbcontrol) this.menuChangeList.push({ 'type': 'Pavilion', 'pavilion': pavilion });

  }

  goToPavilionSceneUp(pavilion, positionBefore, positionAfter) {

    if (!pavilion.resources || !pavilion.resources.scenes || positionBefore == 0) return;

    let scenesList = [];
    let scenes = pavilion.resources.scenes;
    let sceneTemp = null;
    for (let i = scenes.length - 1, scene = null; i >= 0; i--) {
      scene = scenes[i];
      if (i == positionAfter) {
        scenesList.push(sceneTemp);
      }
      else if (i == positionBefore) {
        sceneTemp = scene;
        scenesList.push(scenes[positionAfter]);
      }
      else {
        scenesList.push(scene);
      }
    }

    const scenesListRevert = [];

    for (let i = scenesList.length - 1, scene = null; i >= 0; i--) {
      scene = scenesList[i];
      scenesListRevert.push(scene);
    }

    pavilion.resources.scenes = scenesListRevert;

    let mbcontrol = false;
    for (let menuChange of this.menuChangeList) {
      if (menuChange.type == 'Pavilion' && menuChange.pavilion.id == pavilion.id) {
        mbcontrol = true;
      }
    }

    if (!mbcontrol) this.menuChangeList.push({ 'type': 'Pavilion', 'pavilion': pavilion });

  }

  addEditedScene(list, sceneLayout, indx) {
    const scene = sceneLayout.scene ? sceneLayout.scene : sceneLayout.pavilion;
    const type = sceneLayout.scene ? 'sceneFair' : 'scenePavilion';
    this.editMenu = true;

    if (type == 'sceneFair') {
      list.push({ 'scene': scene, 'type': type, 'iScene': sceneLayout.iScene });
    }
    if (type == 'scenePavilion') {
      list.push({ 'pavilion': scene, 'type': type, 'iScene': sceneLayout.iScene });
    }

    this.fair.location.push({ 'type': type, 'iScene': sceneLayout.iScene, 'menuPosition': indx + 1 });
  }


  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  updateSceneMenu() {

    this.loading.present({ message: 'Cargando...' });
    let finish = false;

    if (this.menuChangeList && this.menuChangeList.length > 0) {
      for (let menuChange of this.menuChangeList) {
        if (menuChange.type == 'Fair') {
          const fair = Object.assign({}, { 'id': this.fair.id, 'location': JSON.stringify(this.fair.location) });
          this.adminFairsService.updateFair(fair)
            .then((response) => {
              if (!finish) {
                this.loading.dismiss();
                finish = true;
                this.menuChangeList = [];
                this.editMenu = false;
              }
            });
        }
        if (menuChange.type == 'Pavilion') {
          const pavilion = Object.assign({}, { 'id': menuChange.pavilion.id, 'fair_id': this.fair.id, 'resources': menuChange.pavilion.resources });
          this.adminPavilionsService.update(pavilion)
            .then((response) => {
              if (!finish) {
                this.loading.dismiss();
                finish = true;
                this.menuChangeList = [];
                this.editMenu = false;
              }
            });
        }
      }
    }

    /*this.loading.present({ message: 'Cargando...' });
    console.log(this.fair.location);

    const fair = Object.assign({}, { 'id': this.fair.id, 'location': JSON.stringify(this.fair.location) });
    this.adminFairsService.updateFair(fair)
      .then((response) => {
        console.log(response);

        this.editMenu = false;
        if (!isExternal) {
          this.presentToast(`Menú guardado con exito`);
          this.loading.dismiss();
        }
        else {
          this.loading.dismiss();

          if (isExternal.typeAction == 'add' && isExternal.type == 'sceneFair') {
            //window.location.replace(`${this.url}/super-admin/map-editor/fair/${isExternal.sceneId}`);
            this.initializeFair();
          }
          else if (isExternal.typeAction == 'remove' && isExternal.type == 'sceneFair') {
            //window.location.replace(`${this.url}/super-admin/fair`);
            this.initializeFair();
          }
          else if (isExternal.typeAction == 'add' && isExternal.type == 'scenePavilion') {
            //window.location.replace(`${this.url}/super-admin/pavilion/${isExternal.sceneId}`);
            this.initializeFair();
          }
          else if (isExternal.typeAction == 'remove' && isExternal.type == 'scenePavilion') {
            //window.location.replace(`${this.url}/super-admin/fair`);
            this.initializeFair();
          }
        }
      })
      .catch(error => {
        this.loading.dismiss();
        console.log(error);
        this.presentToast(`Consultando el servicio para actualizar menú ${error}`);
      });*/
  }

  _getId() {
    return new Date().valueOf() + Math.floor(Math.random() * 1000);
  }

  /*addSceneMenu(type, iScene) {
    var list = [];
    var indx = 1;
    list.push({ 'type': type, 'iScene': iScene, 'menuPosition': indx });
    for (let location of this.fair.location) {
      location.menuPosition++;
      list.push(location);
    }

    this.fair.location = list;
    this.updateSceneMenu({ 'type': type, 'sceneId': iScene, 'typeAction': 'add' });
  }

  removeSceneMenu(type, iScene) {
    var list = [];
    var indxRem = 10000;
    for (let location of this.fair.location) {
      if (location.type == type && location.iScene == iScene) {
        indxRem = location.menuPosition;
      }
      else if (location.menuPosition > indxRem) {
        location.menuPosition--;
        list.push(location);
      }
      else {
        list.push(location);
      }
    }

    this.fair.location = list;

    this.updateSceneMenu({ 'type': type, 'sceneId': iScene, 'typeAction': 'remove' });
  }*/


  onEditMenuClick() {
    this.initializeSceneMenu();
    this.editMenu = true
  }

  onCancelEditMenuClick() {
    this.editMenu = false;
  }

  initializeToopTipMenu() {


    setTimeout(() => {

      let topMenu = 93;

      let icon = document.getElementById('mini-menu-admin-agenda');
      if (icon)
        this.miniMenu.adminAgenda = { top: icon.offsetTop + topMenu, left: icon.offsetLeft };

      icon = document.getElementById('mini-menu-admin-fair');
      if (icon)
        this.miniMenu.adminFair = { top: icon.offsetTop + topMenu, left: icon.offsetLeft };

      icon = document.getElementById('mini-menu-admin-speaker');
      if (icon)
        this.miniMenu.adminSpeaker = { top: icon.offsetTop + topMenu, left: icon.offsetLeft };

      icon = document.getElementById('mini-menu-first');
      if (icon)
        topMenu += icon.offsetHeight;

      icon = document.getElementById('mini-menu-back');
      if (icon)
        this.miniMenu.menuBack = { top: icon.offsetTop + topMenu, left: icon.offsetLeft + 200 };

      icon = document.getElementById('mini-menu-forward');
      if (icon)
        this.miniMenu.menuForward = { top: icon.offsetTop + topMenu, left: icon.offsetLeft };


      let i = 0;
      for (let sceneLayout of this.sceneLayoutList) {

        if (sceneLayout.type == 'sceneFair' && (sceneLayout.scene.show || (this.editMenu && this.profileRole && this.profileRole.admin))) {
          icon = document.getElementById('mini-menu-scene-' + i);
        }
        if (sceneLayout.type == 'scenePavilion') {
          icon = document.getElementById('mini-menu-pavilion-' + i);
        }

        if (icon) {
          this.miniMenu['menuScene' + i] = { top: icon.offsetTop + topMenu, left: icon.offsetLeft };
        }

        i++;
      }

      icon = document.getElementById('mini-menu-second');
      if (icon)
        topMenu += icon.offsetHeight;

      icon = document.getElementById('mini-menu-third');
      if (icon)
        topMenu += icon.offsetHeight;

      icon = document.getElementById('mini-menu-account');
      if (icon) {
        topMenu += icon.offsetTop;
        this.miniMenu.account = { top: icon.offsetTop + topMenu, left: icon.offsetLeft };
      }

      icon = document.getElementById('mini-menu-logout');
      if (icon)
        this.miniMenu.logout = { top: icon.offsetTop + topMenu, left: icon.offsetLeft };

    }, 1000);

  }

  onMenuHover($event, id) {
    this.menuHover = id;
    if (this.miniMenu[this.menuHover]) {
      this.miniMenu[this.menuHover].top = $event.pageY - $event.offsetY;
    }

    if (this.mobileApp) {
      setTimeout(() => {
        this.menuHover = '';
      }, 3000);
    }

  }


  goToLive(agendaLive) {

    if (!this.userDataSession) {
      this.presenterLogin({ 'liveStream': agendaLive });
      return;
    }

    this.loading.present({ message: 'Cargando...' });

    const email = this.userDataSession.email;
    this.agendasService.generateMeetingToken(this.fair.id, agendaLive.id, this.userDataSession)
      .then(response => {
        const token = response.data;

        //const url = `https://us02web.zoom.us/j/${agendaLive.zoom_code}`;
        const url = `https://us02web.zoom.us/j/${agendaLive.zoom_code}`;
        //const url = 'https://us06web.zoom.us/wc/89928030737/start';

        //const url = `${SERVER_URL}/viewerZoom/meetings/${token}`;
        const windowReference = window.open();
        if (windowReference) windowReference.location.href = url;
        //window.location.href = url;

        this.loading.dismiss();

      }, error => {
        this.loading.dismiss();
        this.errors = error;
      });
  }


  animationLiveInterval() {

    this.startAnimationLive('#obj-1');

    var interval = setInterval(() => {
      var div = document.querySelector('#obj-1');
      console.log('valida animacion');
      if (div) {
        this.startAnimationLive('#obj-1');
        console.log('startamination');
        clearInterval(interval);
      }
    }, 1500);
  }

  async startAnimationLive(selectorObj) {

    setInterval(() => {
      this.liveUrlBotton = this.liveUrlBotton == this.fair.resources.liveBotton ? this.fair.resources.liveBottonHover : this.fair.resources.liveBotton;
    }, 500);

    const squareA = this.animationCtrl.create()
      .addElement(document.querySelector(selectorObj))
      .duration(2000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.2)' },
        { offset: 1, transform: 'scale(1)' }
      ])

    await squareA.play();
  }
}
