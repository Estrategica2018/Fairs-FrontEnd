import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { MenuController, IonSlides, ToastController } from '@ionic/angular';
import { AdminFairsService } from './../../api/admin/fairs.service';
import { Storage } from '@ionic/storage';
import { environment, SERVER_URL } from '../../../environments/environment';
import { LoadingService } from '../../providers/loading.service';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
  styleUrls: ['./admin.scss'],
})
export class AdminPage {
  showSkip = true;
  
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  @ViewChild('slides', { static: true }) slides: IonSlides;
  fairList = [];
  showNewFair = false;
  success: String = null;
  errors: String = null;
  fairDeleted = null;
  fair = { 'name': '', 'description': '', 'social_media': {'icon':'assets/icon/icon.png'}, 'end_date':'', 'init_date':''};

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage,
	private adminFairsService: AdminFairsService,
	private toastCtrl: ToastController,
	private alertCtrl: AlertController,
	private loading: LoadingService,
  ) {}

 ngDoCheck(){
   document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
 }
 
  startApp(fair) {
    /*this.router
      .navigateByUrl('/schedule', { replaceUrl: true })
      .then(() => this.storage.set('ion_did_tutorial', true));*/
	  
    const windowReference = window.open();
	let url = '';
	if(environment.production ) {
		url = 'https://'+fair.name+'.'+SERVER_URL.split('https://')[1];
		windowReference.location.href = url;
	}
	else {
		windowReference.location.href = "#";
	}
  }
  
  startNewFair() {
	let newFair = Object.assign({ 
	 'halls_number':0,
	 'location': '{}',
	 'resources': '{"scenes":[]}'
	},this.fair);

	newFair = Object.assign(newFair,{
	 'social_media': JSON.stringify(newFair.social_media)
	});	
	
	this.success = null;
	this.errors = null;
	
	this.loading.present({message:'Cargando...'});
	
	this.adminFairsService.createFair(newFair).
	 then( response => { 
	 console.log(response);
	    if(response.success == 201) {
		  this.presentToast(`Feria creada exitósamente`);
		  this.fair = { 'name': '', 'description': '', 'social_media': {'icon':'assets/icon/icon.png'}, 'end_date':'', 'init_date':''};
		  this.ionViewWillEnter();
		  this.showNewFair = false;
	    }
		else {
			this.errors = `Error creando la feria ` + ( response.data || '' );
			this.presentToast(`Error creando la feria`);
			this.loading.dismiss();
		}
	  })
	  .catch(error => {
		   console.log(error);
		   this.errors = error.data || ( error.message ? error.message : '' ) || error;
		   if(this.errors.length > 76) { this.errors = this.errors.substr(0,76); }
		   this.errors = `Error creando la feria ${this.errors}`
		   this.presentToast(`Error creando la feria`);
		   this.loading.dismiss();
	  });
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  ionViewWillEnter() {
   this.fairList = [];
   this.adminFairsService.allList().
      then( response => { 
	    if(response.success == 201) {
		  this.fairList =   response.data;
		  this.loading.dismiss();
	    }
		else {
			this.errors = `Error consultando la feria ` + ( response.data || '' );
			this.presentToast(`Error consultando la feria`);
			this.loading.dismiss();
		}
	  })
	  .catch(error => {
		   this.loading.dismiss();
	  });
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });  
    toast.present();
  }


  async toogleShowFair(fair,newLocation) {
      
	this.success = null;
	this.errors = null;
	
	
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: !newLocation ? 'Publicar Feria?' : 'Ocultar Feria?',
      subHeader: !newLocation ? 'Confirma para publicar la feria' : 'Confirma para ocultar la feria',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            fair.location = !fair.location;
          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {
            
			this.loading.present({message:'Cargando...'});
			let newFair = {'location': !newLocation ? 'true':'false','id':fair.id };
			
            this.adminFairsService.updateFair(newFair)
              .then((response) => {
				if(response.success === 201) {
					console.log(response.data_fair.location);
					this.success = response.data_fair.location === 'true' ? `Feria publicada exitosamente` : `La feria se encuentra oculta`;
				    //fair.location = response.data_fair.location === 'true';
					this.ionViewWillEnter();
					this.presentToast(this.success);
					this.fairDeleted = fair.id;
				}
				else {
					this.errors = !newLocation ? `Ha ocurrido un error al publicar la feria` : `Ha ocurrido un error al ocultar la feria`;
				    this.loading.dismiss();
				}
              },
              (error) => {
                 console.log(error);
                 this.errors = fair.location ? `Ha ocurrido un error al publicar la feria` : `Ha ocurrido un error al ocultar la feria`;
				 this.loading.dismiss();
              })
            .catch(error => {
                console.log(error);
                this.errors = fair.location ? `Ha ocurrido un error al publicar la feria` : `Ha ocurrido un error al ocultar la feria`;
				this.loading.dismiss();
             });        
    
          }
        }
      ]
    });
    await alert.present();
  }
  
  async onDeleteFair(fair) {
	this.success = null;
	this.errors = null;
	
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar Feria?',
      subHeader: 'Confirma para eliminar la feria',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {
    
            this.loading.present({message:'Cargando...'});

            this.adminFairsService.deleteFair(fair)
              .then((response) => {
                this.success = `Feria eliminada exitosamente`;
				this.presentToast(this.success);
                this.ionViewWillEnter();
              },
              (error) => {
                 console.log(error);
                 this.errors = `Ha ocurrido un error al eliminar la feria`;
				 this.loading.dismiss();
              })
            .catch(error => {
                console.log(error);
                this.errors = `Ha ocurrido un error al eliminar la feria`;
				this.loading.dismiss();
             });
          }
        }
      ]
    });
    await alert.present();
  }
}
