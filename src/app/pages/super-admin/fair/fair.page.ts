import { Component, OnInit } from '@angular/core';
import { FairsService } from '../../../api/fairs.service';
import { AgendasService } from './../../../api/agendas.service';
import { CategoryService } from './../../../api/category.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { UsersService } from './../../../api/users.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ToastController,AlertController, ModalController } from '@ionic/angular';
import { processData } from '../../../providers/process-data';
import { LoadingService } from '../../../providers/loading.service';
import { LoginComponent } from '../../login/login.component';
import { NewSceneComponent } from './new-scene/new-scene.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fair',
  templateUrl: './fair.page.html',
  styleUrls: ['./fair.page.scss'],
})
export class FairPage implements OnInit {

  fair: any;
  agendas: any;
  pavilions: any;
  errors: string;
  success: string;
  editSave: any;
  showPrice = false;
  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = ['Domingo', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
  customPickerOptions: any;
  maxYear: any;
  initPickerOptions: any;
  endPickerOptions: any;
  groupsCategoryList = [];
  modal: any;
  userDataSession: any;
  profileRole: any = { admin : false};
  showInitDate = false;
  

  constructor(
    private fairsService: FairsService,
    private agendasService: AgendasService,
    private categoryService: CategoryService,
    private adminFairsService: AdminFairsService,
    private datepipe: DatePipe,
    private alertCtrl: AlertController,
    private loading: LoadingService,
    private modalCtrl: ModalController,
    private usersService: UsersService,
    private toastCtrl: ToastController,
    private router: Router,
  ) { 
     this.maxYear = new Date().getFullYear() + 5;
  }
  
  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
 
  ngOnInit() { 

    
      this.usersService.getUser()
      .then((userDataSession: any)=>{
        this.userDataSession = userDataSession;
        this.profileRole = { admin : false };

        if(this.userDataSession) {
            
            if(userDataSession && userDataSession.user_roles_fair)  {
              userDataSession.user_roles_fair.forEach((role)=>{
                if(role.id == 1) { //"super_administrador"
                   this.profileRole.admin = true;
                }
              });
            }
            
          this.loading.present({message:'Cargando...'});  
          this.fairsService.getCurrentFair().
          then( fair => {
            this.fair = fair;
            this.setBackground();
            this.pavilions = fair.pavilions;
            this.setPavilionBackground();
            this.showPrice = fair.price > 0;
            
            
            this.agendasService.list(this.profileRole.admin)
            .then((agendas) => {
                this.agendas = agendas;
                if(agendas)
                this.agendas.forEach((agenda)=>{
                    agenda.startTime = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
                    agenda.endTime = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
                    agenda.location = agenda.room ? agenda.room.name : '';
                });
                
                this.categoryService.list('all', this.fair)
                .then((response) => {
                    this.groupsCategoryList = [ { "label":"Categorías para agenda", "name": "AgendaType", "values":[] },{ "label":"Categorías para productos", "name": "ProductCategory", "values":[] }];
                    if(response.success == 201 ) {
                       response.data.forEach((category)=>{
                          if(category.type=='AgendaType') { this.groupsCategoryList[0].values.push(category); }
                          else if(category.type=='ProductCategory') { this.groupsCategoryList[1].values.push(category); }
                       });
                    }
                    this.loading.dismiss();
                 })
                 .catch(error => {
                    this.loading.dismiss(); 
                    this.errors = `Consultando el servicio para categorias: ${error}`;
                 });
                
                this.loading.dismiss(); 
                
             })
             .catch(error => {
                this.loading.dismiss(); 
                this.errors = `Consultando el servicio para agenda: ${error}`;
             });
          }, errors => {
              this.errors = errors;
              this.loading.dismiss();     
          })
          .catch(error => {
              this.loading.dismiss();
              this.errors = `Consultando el servicio para agenda: ${error}`;
          });
        }
      });
  }
  
  ionChange() {
    this.editSave = true;
  }  
  
  updateFair() {
      
   this.loading.present({message:'Cargando...'});
   if(!this.showPrice) {    
      this.fair.price = 0;
   }

   const fairObj = Object.assign({},this.fair);
   this.adminFairsService.updateFair(fairObj).
      then( response => {
        this.fair = response.data_fair;
        this.fair.pavilions = this.pavilions;
        this.fair = processData(this.fair);
        this.success = `Feria modificada exitosamente`;
        this.loading.dismiss();      
      }, errors => {
          this.errors = `Consultando el servicio para modificar feria`;
          this.loading.dismiss();
      })
    .catch(error => {
        this.errors = error; 
        this.loading.dismiss();
     });      
  }
  
  async copy(itemId) {
    let aux = document.createElement("input");
    aux.setAttribute("value",`https://${this.fair.name}.e-logic.com.co`);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    const toast = await this.toastCtrl.create({
      message: 'Texto copiado en el portapapeles', 
      duration: 2000
    });
    toast.present();
  }
  
  async presentActionPrice() {
      
    if(!this.showPrice) return;
    
    const actionAlert = await this.alertCtrl.create({
      header: 'Precio general de la feria',
      message: "Ingresa un precio general para toda la feria",
      inputs: [
        {
          name: 'price',
          value: this.fair.price,
          placeholder: '$ Precio'
        },
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Guardar', 
         role: 'destructive', 
         handler: (data) => {
          this.editSave = true;
          this.fair.price = data.price;
         }
        }]
    });
    await actionAlert.present();

  }
  
  async presentActionIcons() {
    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa la Url deL ícono la feria",
      inputs: [{
          name: 'icon',
          label: 'Icono Logo',
          value: this.fair.social_media.icon,
          placeholder: ''
        }],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Guardar', 
         role: 'destructive', 
         handler: (data) => {
          this.editSave = true;
          this.fair.social_media.icon = data.icon;
         }
        }]
    });
    await actionAlert.present();

  }
  
  setBackground() {
      let i=0;
      this.fair.resources.scenes.forEach((scene)=>{
         let style = document.createElement('style');
         style.type = 'text/css';
         style.innerHTML = '.customSceneCSSClass' + i + '{--ion-item-background: '+scene.backgroundColor+'; background-color: '+scene.backgroundColor+'}';
         document.getElementsByTagName('head')[0].appendChild(style);
         i++;
      });
  }

  setPavilionBackground() {
      let i=0;
      this.pavilions.forEach((pavilion)=>{
        if(pavilion.scenes)
        pavilion.scenes.forEach((scene)=>{
           let style = document.createElement('style');
           style.type = 'text/css';
           style.innerHTML = '.customSceneCSSClassP-'+pavilion.id + i + '{--ion-item-background: '+scene.backgroundColor+'}';
           document.getElementsByTagName('head')[0].appendChild(style);
           i++;
        });
      });
  }
  
  async presenterTerms() {
    
    if(this.modal) { this.modal.dismiss(); }
    
    this.modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this,
        'showMenu': 'terms',
        'admin': this.userDataSession
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  }

  async presentNewScene() {
      

    if(this.modal) { this.modal.dismiss(); }
    
    this.modal = await this.modalCtrl.create({
      component: NewSceneComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this,
        'userDataSession': this.userDataSession
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  }

  ionChangeInitDate(initDateTime){
    this.fair.init_date = initDateTime;
    this.ionChange();
  } 
  
  ionChangeEndDate(endDateTime){
    this.fair.end_date = endDateTime;
    this.ionChange();
  }
  
  async toogleShowFair(newLocation) {
      
    this.success = null;
    this.errors = null;
    
    const alert2 = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: !newLocation ? 'Publicar Feria?' : 'Ocultar Feria?',
      subHeader: !newLocation ? 'Confirma para publicar la feria' : 'Confirma para ocultar la feria',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.fair.location = !this.fair.location;
          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {
            
            this.loading.present({message:'Cargando...'});
            let newFair = {'location': this.fair.location ? 'true':'false','id':this.fair.id };
            
            this.adminFairsService.updateFair(newFair)
              .then((response) => {
                  
                this.success = this.fair.location ? `Feria publicada exitosamente` : `La feria se encuentra oculta`;
                this.presentToast(this.success);
                this.loading.dismiss();
              },
              (error) => {
                 console.log(error);
                 this.errors = this.fair.location ? `Ha ocurrido un error al publicar la feria` : `Ha ocurrido un error al ocultar la feria`;
                 this.loading.dismiss();
              })
            .catch(error => {
                console.log(error);
                this.errors = this.fair.location ? `Ha ocurrido un error al publicar la feria` : `Ha ocurrido un error al ocultar la feria`;
                this.loading.dismiss();
             });        
    
          }
        }
      ]
    });
    await alert2.present();
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });  
    toast.present();
  }
  
  onClickFairScene(scene,iScene) {
    if(scene.rows) {
      this.redirectTo('/super-admin/map-site-editor/fair/' + iScene);
    }
    else {
      this.redirectTo('/super-admin/map-editor/fair/' + iScene);
    }
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }
} 