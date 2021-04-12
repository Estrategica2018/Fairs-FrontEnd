import { Component, OnInit } from '@angular/core';
import { AgendasService } from './../../../api/agendas.service';
import { FairsService } from './../../../api/fairs.service';
import { SpeakersService } from './../../../api/speakers.service';
import { CategoryService } from './../../../api/category.service';
import { AdminAgendasService } from './../../../api/admin/agendas.service';
import { LoadingService } from './../../../providers/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { AlertController, ModalController,IonRouterOutlet } from '@ionic/angular';
import {  } from '@ionic/angular';
import { SpeakersSelectPage } from '../speakers-select/speakers-select.page';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  agenda: any;
  errors: string = null;
  success: string = null;
  fair: any;
  action: string;
  categories = [];
  speakers = [];
  
  
  constructor(
    private agendasService: AgendasService,
    private routeActivated: ActivatedRoute,
    private router: Router,
    private loading: LoadingService,
    private adminAgendasService: AdminAgendasService,
    private fairsService: FairsService,
	private speakersService: SpeakersService,
	private categoryService: CategoryService,
    private alertCtrl: AlertController,
	private modalCtrl: ModalController,
	private routerOutlet: IonRouterOutlet,
    ) { 
	}

  ngOnInit() {
      
    this.fairsService.getCurrentFair().then((fair)=>{
        this.fair = fair;
    });
	
    this.speakersService.
	    list().then((speakers)=>{
          this.speakers = speakers;
        })
        .catch(error => {
            reject(error)
        });
	
	this.categoryService.list('AgendaType').then((response)=>{
		if(response.success == 201) {
			this.categories = response.data;
			const agendaId = this.routeActivated.snapshot.paramMap.get('agendaId');
			if(agendaId ) {
			  this.action = 'update';
			  this.loading.present({message:'Cargando...'});
			  this.agendasService.get(agendaId)
			   .then((agenda) => {
				  this.loading.dismiss();
				  this.errors = null;
				  this.agenda = agenda;
				  this.agenda.duration_time = this.agenda.duration_time.toString();
				  if(this.agenda.category) this.agenda.category.id = this.agenda.category.id.toString();
				  this.agenda.start_at_str = moment(this.agenda.start_at).format('DD/MM/YYYY HH:mm');
			  })
			  .catch(error => {
				 this.loading.dismiss();
				 this.errors = error;
			  });
			}
			else { 
			  this.action = 'create';
			  this.agenda = { 'category':{},'audience_config':1, 'resources': { 'audience_config': { 'type': 1 }, 'url_image': '/assets/icon/null-21_1_joxd4u.jpg' } };
			}
		}
		else {
			this.errors = `Consultando las categorias de agenda`;
		}
	});
  }
  
  durations: any[] = [
    { id: 15,name: '15 min'},
    { id: 30,name: '30 min'},
    { id: 45,name: '45 min'},
    { id: 60,name: '1 hora'},
    { id: 90,name: '1 hora y 30 min'},
    { id: 120,name: '2 horas'},
    { id: 150,name: '2 horas y 30 min'},
    { id: 180,name: '3 horas'}
  ];
  
  timezones: any[] = [
    { name: 'America/Bogota'},
    { name: 'America/Mexico_City'},
    { name: 'America/New_York'},
    { name: 'America/Sao_Paulo'},
    { name: 'America/Argentina/Buenos_Aires'}
  ];
  
  audiences: any[] = [
    { id: 1, name: 'Publico general'},
    { id: 2, name: 'Lista de correo'},
    { id: 3, name: 'Acceso por token'}
  ];

  onCreateAgenda() {
    const data = Object.assign({ 'topic': this.agenda.title, 
		'agenda' : this.agenda.description, 'fair_id': this.fair.id }, this.agenda);
    
    this.errors = null;
    this.success = null;
    this.loading.present({message:'Cargando...'});
    
    this.adminAgendasService.create(data)
      .then((response) => {
        this.loading.dismiss();
        this.success = `Agenda creada exitosamente`;
        //this.fairsService.refreshCurrentFair().then((fair)=>{
            //this.fair = fair;
            //const tab = `/super-admin/fair`;
            //this.onRouterLink(tab)
            this.action = 'update';
            this.agenda = response.agenda;
        //});
      },
      (error) => {
          this.loading.dismiss();
          this.errors = error;
      })
    .catch(error => {
        this.loading.dismiss();
        this.errors = error; 
     });    
  }

  onUpdateAgenda() {
   //this.agenda.topic = this.agenda.title;
   //this.agenda.agenda = this.agenda.description;
   //this.agenda.fair_id = this.fair.id;
    const data = Object.assign(this.agenda,{ 'topic': this.agenda.title, 'agenda' : this.agenda.description, 'fair_id': this.fair.id, 'category_id': this.agenda.category.id});
    this.errors = null;
    this.success = null;
    
    this.adminAgendasService.update(data)
      .then((response) => {
        this.success = `Agenda modificada exitosamente`;
       //this.fairsService.refreshCurrentFair().then((fair)=>{
       //    //this.fair = fair;
       //    //const tab = `/super-admin/fair`;
       //    //this.onRouterLink(tab);
       //});
      },
      (error) => {
          this.errors = error;
      })
    .catch(error => {
        this.errors = error; 
     });    
  }

  async onDeleteAgenda() {
    
      const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borra agenda?',
      subHeader: 'Confirmar para borrar la agenda',
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
            this.adminAgendasService.delete(this.agenda)
              .then((response) => {
                this.success = `Agenda borrada exitosamente`;
                this.fairsService.refreshCurrentFair().then((fair)=>{
                    //this.fair = fair;
                    const tab = `/super-admin/fair`;
                    this.onRouterLink(tab);
                });
              },
              (error) => {
                  this.errors = error;
              })
            .catch(error => {
                this.errors = error; 
             });        
    
          }
        }
      ]
    });
    await alert.present();
    
  }
  
  onChangeStartTime(){
    this.agenda.start_time = this.agenda.start_at_str;
  }
  
  async onChangeImage() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: '',
      message: `<img src="${this.agenda.resources.url_image}" class="card-alert">`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.agenda.resources.url_image = data.url;
          }
        }
      ],
      inputs: [
        {
          name: 'url',
          type: 'text',
          placeholder: 'Url',
          value: this.agenda.resources.url_image
        }
      ]
    });
    await alert.present();
  }
  
  onRouterLink(tab) {
    this.router.navigate([tab]);
  }
  
  async presentSpeakers() {
    const modal = await this.modalCtrl.create({
      component: SpeakersSelectPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
		  'invited_speakers': this.agenda.invited_speakers,
		  'speakers': this.speakers,
		  'fair_id': this.fair.id,
		  'meeting_id': this.agenda.id,
	  }
    });
    await modal.present();
    this.success = null;
	this.errors = null;
    const { data } = await modal.onWillDismiss();
	if (data) {
	  this.agendasService.updateSpeakers(this.fair_id,this.agenda.id, { 'invited_speakers': data })
	    .then((invited_speakers)=>{
			this.success = `Conferencias asociados exitosamente`;
        })
        .catch(error => {
			this.errors = error;
        });
		
	}
  } 

}
