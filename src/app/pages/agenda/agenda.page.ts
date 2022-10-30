import { Component, ViewChild, OnInit } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { AgendasService } from '../../api/agendas.service';
import { DatePipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../providers/loading.service';
import { SpeakerDetailComponent } from './../speaker-list/speaker-detail/speaker-detail.component';
import { ScheduleDetailComponent } from './../schedule/schedule-detail/schedule-detail.component';
import { ModalController, ToastController } from '@ionic/angular';
import { UsersService } from './../../api/users.service';
import { SpeakersService } from './../../api/speakers.service';
import { ShoppingCartsService } from './../../api/shopping-carts.service';
import { FairsService } from './../../api/fairs.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { environment, SERVER_URL } from './../../../environments/environment';
import * as moment from 'moment-timezone';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  errors: string = null;
  speaker: any;
  modalSpeaker: any;
  modal : any;
  agenda: any;
  speakerModal = true;
  speakerDetailComponent = SpeakerDetailComponent;
  userDataSession = null;
  loggedIn = false;
  profileRole= null;
  eventPayment = false;
  fair: any;
  loaded = false;
  showConfirmByProduct : any;
  showRegister = false;
  showSupportDetail = false;
  contactForm: FormGroup;
  invited_speakers = [];
  speakers = [];
  url = SERVER_URL;
  
  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private agendasService: AgendasService,
    private datepipe: DatePipe,
    private router: Router,
    private loading: LoadingService,
    //private routerOutlet: IonRouterOutlet,
    private shoppingCartsService: ShoppingCartsService,
    private usersService: UsersService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private fairsService: FairsService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private dom:DomSanitizer,
    private speakersService: SpeakersService,
  ) {   
  }

  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  ngOnInit() {
      
    this.loading.present({message:'Cargando...'});
    this.fairsService.getCurrentFair().then((fair)=>{
        this.fair = fair;
        
        const agendaId = this.route.snapshot.paramMap.get('agendaId');
        
          this.agendasService.get(agendaId,false)
           .then((agenda) => {
              this.loading.dismiss();
              this.invited_speakers = [];
              this.errors = null;
              this.agenda = Object.assign({},agenda);
              this.agenda.invited_speakers.forEach((speaker)=>{
                 this.invited_speakers.push(Object.assign({},speaker));
              });
              this.agenda.invited_speakers = null;
              this.agenda.duration_time = this.agenda.duration_time.toString();
              if(this.agenda.category) this.agenda.category.id = this.agenda.category.id.toString();
              
              const start_time = moment(this.agenda.start_at).format('YYYY-MM-DDTHH:mm');
              //this.agenda.start_at_str = this.agenda.start_time;
              //const date = start_time.substr(0,10); 
              //const hour = start_time.substr(11,5); 

              this.agenda.strDay = this.datepipe.transform(new Date(this.agenda.start_at), 'EEEE, MMMM d, y');
              this.agenda.startTime = this.datepipe.transform(new Date(this.agenda.start_at), 'hh:mm a');
              this.agenda.endTime = this.datepipe.transform(new Date(this.agenda.start_at + this.agenda.duration_time * 60000), 'hh:mm a');
              this.agenda.location = this.agenda.room ? this.agenda.room.name : '';
              
              this.initializeAgenda();
          })
          .catch(error => {
             this.loading.dismiss();
             this.errors = error;
          });
    
        this.speakersService.
        list().then((speakers)=>{
          this.speakers = speakers;
        })
        .catch(error => {
            this.errors = error;
        });
    });
  }
  
  contactSendForm(form) {
      
      const sentToEmail = this.fair.resources.supportContact;
      const data = { 
        'send_to': sentToEmail,
        'name': form.value.name,
        'email': form.value.email,
        'subject': form.value.subject,
        'message': form.value.message,
        'fairId': this.fair.id
      };
      
      this.loading.present({message:'Cargando...'});
      this.fairsService.sendMessage(data)
      .then((response)=>{
         this.presentToast(response.message);
         this.errors = null;
         this.loading.dismiss();
      }, error => {
        this.loading.dismiss();
        this.errors = error;
        this.presentToast(this.errors);
      });
  }  
  
  initializeAgenda() {
    
    this.loading.present({message:'Cargando...'});
    
    this.usersService.getUser().then((userDataSession: any)=>{
      this.userDataSession = userDataSession;    
      if(userDataSession)  {
      
        this.profileRole = {};
        if(userDataSession.user_roles_fair) {
          userDataSession.user_roles_fair.forEach((role)=>{
            if(role.id == 1) { //"super_administrador"
               this.profileRole.admin = true;
            }
            if(role.id == 6) { //"conferencista"
               this.agendasService.get(this.agenda.id, false)
                .then( (agenda)=>{
                  if(agenda.invited_speakers) {
                      agenda.invited_speakers.forEach((invited_speaker)=>{
                          if(invited_speaker.speaker.user.email ==  this.userDataSession.email) {
                            this.profileRole.speaker = true;
                          }
                      });
                  }
                });  
            }
          }); 
        }
        if(this.agenda.audience_config == 4) {
          this.usersService.getPaymentUser({type:"Event",id:this.agenda.id},userDataSession).
            then( (payment:any) => {
             
            if(payment.success === 201) {
              this.eventPayment = true;
              this.loaded = true;
              this.loading.dismiss();
              
            } else {
              this.eventPayment = false;
              this.loaded = true;
              this.loading.dismiss();
             }
            
          },error => {
            this.errors = `${error}`;
            this.loaded = true;
            this.loading.dismiss();
          });
        } else {
            this.errors = null;
            this.loaded = true;
            this.loading.dismiss();
        }
      
         this.contactForm = this.formBuilder.group({
            name: [this.userDataSession.name  + ' '  + this.userDataSession.last_name, Validators.required],
            email: [this.userDataSession.email, Validators.required],
            message: ['', Validators.required],
            subject: ['', Validators.required]
          });
      }
      else {
          this.contactForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            message: ['', Validators.required],
            subject: ['', Validators.required]
          });
          this.loading.dismiss();
          this.errors = null;
          this.loaded = true;
      }
    });
    
    this.agenda.strDay = this.datepipe.transform(new Date(this.agenda.start_at), 'EEEE, MMMM d, y');
    this.agenda.startHour = this.datepipe.transform(new Date(this.agenda.start_at), 'hh:mm a');
    this.agenda.endTime = this.datepipe.transform(new Date(this.agenda.start_at + this.agenda.duration_time * 60000), 'hh:mm a');
    this.agenda.location = this.agenda.room ? this.agenda.room.name : '';
  }
  
  onSupportClick() {
     //this.showSupportDetail = true;
     this.openAgenda(this.agenda);
  }
  
  
  async openAgenda(session) {

    this.modal = await this.modalCtrl.create({
      component: ScheduleDetailComponent,
      cssClass: ['agenda-modal','boder-radius-modal'],
      componentProps: {
        '_parent': this,
        'agenda': session,
        'speakerDetailComponent': this.speakerDetailComponent,
        'type': 'Agenda',
        'optionTab': 'showSupportDetail'
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  } 
  

  onSpeaker(speaker) {
    if(!this.speakerModal) {
      this.presenterSpeakerModal(speaker);
    }
  }

  async presenterSpeakerModal(speaker) {
    this.modalSpeaker = await this.modalCtrl.create({
      component: this.speakerDetailComponent,
      cssClass: 'speaker-modal',
      swipeToClose: true,
      //backdropDismiss:false,
      //presentingElement: this.routerOutlet.nativeEl,
      componentProps: { speaker: speaker, scheduleMode: true }
    });
    await this.modalSpeaker.present();

    const { data } = await this.modalSpeaker.onWillDismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }  
  
  async onRegister() {

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
  
  checkLoginStatus() {
    return this.usersService.isLoggedIn().then(user => {
      return this.updateLoggedInStatus(user);
    });
  }

  updateLoggedInStatus(user: any) {
    this.loggedIn = ( user !== null );
  }
  
  onBuyAgenda() {
      this.loading.present({message:'Cargando...'});
      this.shoppingCartsService.addShoppingCart(this.fair, null, null, this.agenda, 1, this.userDataSession )
      .then((response) => {
        this.loading.dismiss();
        this.showConfirmByProduct = false;
        this.presentToast('Producto agredado exitósamente al carrito de compras');
        this.closeModal();
        window.dispatchEvent(new CustomEvent( 'user:shoppingCart'));
        window.dispatchEvent(new CustomEvent( 'open:shoppingCart'));
      })
      .catch(error => {
        this.loading.dismiss(); 
        this.presentToast('Ocurrió un error al agregar al carrito de compras: ['+ error +']'); 
      });
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      //cssClass: cssClass,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  
  onAgendaPrice() {
      
     if(this.userDataSession) {
        if(this.eventPayment) {
          
        }
        else { 
          this.showConfirmByProduct = true;
        }
     }
     else {
        this.showRegister = true;
     }
  }
  
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }

  onViewerMeeting() {
    const fair_id = this.fair.id;
    const meeting_id = this.agenda.id;
      
    if(this.userDataSession!=null) {
        
        this.loading.present({message:'Cargando...'});
        
        const email = this.userDataSession.email;
        this.agendasService.generateMeetingToken(fair_id, meeting_id, this.userDataSession) 
        .then( response => {
          const token = response.data;
          const url = `${this.url}/viewerZoom/meetings/${token}`;
          
          const windowReference = window.open();
          windowReference.location.href = url;
          this.loading.dismiss();
          
        },error => {
           this.loading.dismiss();
           this.errors = error;
        });
    }
    else {
        this.showRegister = true;
    }
      
  }  
}