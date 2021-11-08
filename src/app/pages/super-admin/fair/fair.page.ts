import { Component, OnInit } from '@angular/core';
import { FairsService } from '../../../api/fairs.service';
import { AgendasService } from './../../../api/agendas.service';
import { CategoryService } from './../../../api/category.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { DatePipe } from '@angular/common';
import { ToastController,AlertController } from '@ionic/angular';
import { processData } from '../../../providers/process-data';
import { ActionSheetController } from '@ionic/angular';
import { LoadingService } from '../../../providers/loading.service';

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


  constructor(
    private fairsService: FairsService,
    private agendasService: AgendasService,
    private categoryService: CategoryService,
    private adminFairsService: AdminFairsService,
    private datepipe: DatePipe,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private loading: LoadingService
  ) { 
  
   
   this.maxYear = new Date().getFullYear() + 2;
   this.initPickerOptions = {
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          return false;
        }
      },
      {
        text: 'Guardar',
        handler: (data) => { 
          this.fair.init_date = data.year.value+'-'+data.month.value+'-'+data.day.value;
        }
      }]
    }
  
   this.endPickerOptions = {
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          return false;
        }
      },
      {
        text: 'Guardar',
        handler: (data) => { 
          this.fair.end_date = data.year.value+'-'+data.month.value+'-'+data.day.value;
        }
      }]
    }
  }
  
  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
 
  ngOnInit() { 
      this.loading.present({message:'Cargando...'});  
      this.fairsService.getCurrentFair().
      then( fair => {
        this.fair = fair;
        this.setBackground();
        this.pavilions = fair.pavilions;
        this.setPavilionBackground();
        this.showPrice = fair.price > 0;
        
        
        this.agendasService.list()
        .then((agendas) => {
            this.agendas = agendas;
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
  
  ionChange() {
    this.editSave = true;
  }  
  
  updateFair() {
      
   this.loading.present({message:'Cargando...'});
   if(!this.showPrice) {    
      this.fair.price = 0;
   }

   const fairObj = Object.assign({},this.fair);
   this.adminFairsService.update(fairObj).
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
    aux.setAttribute("value", document.getElementById(itemId).innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    const toast = await this.toastController.create({
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
         style.innerHTML = '.customSceneCSSClass' + i + '{--ion-item-background: '+scene.backgroundColor+'}';
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
} 