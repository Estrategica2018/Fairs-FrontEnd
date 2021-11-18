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
import { ActionSheetController } from '@ionic/angular';
import { SpeakersSelectPage } from '../speakers-select/speakers-select.page';
import { AudienceSelectPage } from '../audience-select/audience-select.page';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  agenda: any;
  errors: any = null;
  success: string = null;
  fair: any;
  action: string;
  categories = [];
  speakers = [];
  emails: any = [];
  editSave = null;
  invited_emails: any = [];
  invited_speakers: any = [];
  
  
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
    private actionSheetController: ActionSheetController
    ) { 
        this.agenda = { 'category':{},'audience_config':1, 'resources': { 'audience_config': { 'type': 1 }, 'url_image': 'https://dummyimage.com/620x348/EFEFEF/000.png' } };
    }
    
  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.invited_speakers = [];
    this.fairsService.getCurrentFair().then((fair)=>{
        this.fair = fair;
        
        const agendaId = this.routeActivated.snapshot.paramMap.get('agendaId');
        if(agendaId!=null) {
            this.adminAgendasService.getEmails(this.fair.id, agendaId).then((response)=>{
              this.emails = response.data.audience;
              this.invited_emails = this.emails.filter((audience)=>{
                 return audience.check == 1; 
              });
            })
            .catch(error => {
                this.errors = error;
            });
        }
        this.categoryService.list('AgendaType',this.fair).then((response)=>{
            if(response.success == 201) {
                this.categories = response.data;
                const agendaId = this.routeActivated.snapshot.paramMap.get('agendaId');
                if(agendaId ) {
                  this.action = 'update';
                  this.loading.present({message:'Cargando...'});
                  this.agendasService.get(agendaId)
                   .then((agenda) => {
                      this.loading.dismiss();
                      this.invited_speakers = [];
                      agenda.invited_speakers.forEach((speaker)=>{
                         this.invited_speakers.push(Object.assign({},speaker));
                      });
                      agenda.invited_speakers = null;
                      this.errors = null;
                      this.agenda = agenda;
                      this.agenda.duration_time = this.agenda.duration_time.toString();
                      if(this.agenda.category) this.agenda.category.id = this.agenda.category.id.toString();
                      this.agenda.start_time = moment(this.agenda.start_at).format('YYYY-MM-DDTHH:mm');
                      this.agenda.start_at_str = this.agenda.start_time;
                  })
                  .catch(error => {
                     this.loading.dismiss();
                     this.errors = error;
                  });
                }
                else { 
                  this.action = 'create';
                }
            }
            else {
                this.errors = `Consultando las categorias de agenda`;
            }
        });

    });
    
    this.speakersService.
    list().then((speakers)=>{
      this.speakers = speakers;
    })
    .catch(error => {
        this.errors = error;
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
    { id: 1, name: 'Público general'},
    { id: 2, name: 'Lista de correo'},
    { id: 3, name: 'Pago dentro de la feria'},
    { id: 4, name: 'Pago por evento'}
  ];

  onCreateAgenda() {
    const data = Object.assign({ 'topic': this.agenda.title, 
                                 'agenda' : this.agenda.description, 'fair_id': this.fair.id,
                                 'category_id': this.agenda.category.id }, this.agenda);
    
    this.errors = null;
    this.success = null;
    this.loading.present({message:'Cargando...'});
    
    this.adminAgendasService.create(data)
      .then((response) => {
        this.loading.dismiss();
            this.agenda = response.agenda;    
            this.fairsService.refreshCurrentFair();
            this.agendasService.refreshCurrentAgenda();
            this.success = `Agenda creada exitosamente`;
            this.redirectTo(`/super-admin/agenda/${this.agenda.id}`);
            

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
    this.loading.present({message:'Cargando...'});
    const data = Object.assign(this.agenda,{ 'topic': this.agenda.title, 'agenda' : this.agenda.description, 'fair_id': this.fair.id, 'category_id': this.agenda.category.id});
    this.errors = null;
    this.success = null;
    
    this.adminAgendasService.update(data)
      .then((response) => {
        this.agendasService.refreshCurrentAgenda();
        this.agendasService.get(this.agenda.id)
        .then((agenda) => {
           this.agenda = agenda;
           
           this.agenda.duration_time = this.agenda.duration_time.toString();
           if(this.agenda.category) this.agenda.category.id = this.agenda.category.id.toString();
           this.agenda.start_time = moment(this.agenda.start_at).format('YYYY-MM-DDTHH:mm');
           this.agenda.start_at_str = this.agenda.start_time;
           this.success = `Agenda modificada exitosamente`;
           this.loading.dismiss();
        })
        .catch(error => {
           this.loading.dismiss();
           this.errors = error;
        });
      },
      (error) => {
         this.errors = error;
         this.loading.dismiss();
      })
    .catch(error => {
        this.errors = error; 
        this.loading.dismiss();
     });    
  }

  async onDeleteAgenda() {
    
      const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borra agenda?',
      subHeader: 'Confirma para borrar la agenda',
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
                this.fairsService.refreshCurrentFair();
                this.redirectTo(`/super-admin/fair`);
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
  
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }
  
  async presentSpeakers() {
    const modal = await this.modalCtrl.create({
      component: SpeakersSelectPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
          'invited_speakers': this.invited_speakers,
          'speakers': this.speakers,
          'fair_id': this.fair.id,
          'meeting_id': this.agenda.id,
      },
      cssClass: 'speakers-modal'
    });
    await modal.present();
    this.success = null;
    this.errors = null;
    const { data } = await modal.onWillDismiss();
    
    if (data) {
      this.loading.present({message:'Cargando...'});
      this.adminAgendasService.updateSpeakers(this.fair.id,this.agenda.id, { 'invited_speakers': data })
        .then((response)=>{
            if(response.success == 201) {
              
              this.agendasService.refreshCurrentAgenda();
              this.agendasService.get(this.agenda.id)
               .then((agenda) => {
                  this.invited_speakers = [];
                  agenda.invited_speakers.forEach((speaker)=>{
                     this.invited_speakers.push(Object.assign({},speaker));
                  });
                  this.success = `Conferencistas asociados exitosamente`;
                  this.loading.dismiss();
              })
              .catch(error => {
                 this.loading.dismiss();
                 this.errors = error;
              });
            }
            else {
                this.loading.dismiss();
                this.errors = `Error modificando los conferencistas en la feria`;
            }
        })
        .catch(error => {
            this.errors = error;
        });
        
    }
  } 
  
  async presentAudience() {
    const modal = await this.modalCtrl.create({
      component: AudienceSelectPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
          'invited_speakers': this.invited_emails,
          'audiences': this.emails,
          'fair_id': this.fair.id,
          'meeting_id': this.agenda.id
      }
    });
    await modal.present();
    this.success = null;
    this.errors = null;
    const { data } = await modal.onWillDismiss();

    if(data) {
        
      data.forEach((audience)=>{
        audience.check = audience.checked ? 1 : 0;
      });
      this.invited_emails = data.filter((audience)=>{
         return audience.check == 1; 
      });
      
      this.adminAgendasService.updateAudience(this.fair.id,this.agenda.id, { 'audience': data })
        .then((invited_emails)=>{
            this.success = `Lista de correos modificada exitósamente`;
        })
        .catch(error => {
            this.errors = error;
        });
        
    }
  } 

  async presentActionPrice() {
      
    let buttons = [];
    buttons.push({
      text: this.agenda.price, 
      role: 'destructive', 
       handler: (value) => {
        this.editSave = true;
      }
    });
    
    buttons.push({
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      });
      
    const actionSheet = await this.alertCtrl.create({
      header: 'Precio del producto',
      message: "Ingresa el precio del producto",
      inputs: [
        {
          name: 'price',
          value: this.agenda.price,
          placeholder: '$ Precio'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.agenda.price = data.price;
          }
        }
      ]
    });
    await actionSheet.present();

  }
  
}