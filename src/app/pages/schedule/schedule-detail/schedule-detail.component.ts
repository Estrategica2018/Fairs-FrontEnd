import { Component, Input } from '@angular/core';

import { ConferenceData } from '../../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../../providers/user-data';
import { AgendasService } from '../../../api/agendas.service';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';
import { LoadingService } from '../../../providers/loading.service';
import { SpeakerDetailComponent } from '../../speaker-list/speaker-detail/speaker-detail.component';
import { ModalController, ToastController } from '@ionic/angular';
import { UsersService } from '../../../api/users.service';
import { ShoppingCartsService } from '../../../api/shopping-carts.service';
import { FairsService } from '../../../api/fairs.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { environment, SERVER_URL } from '../../../../environments/environment';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss'],
})
export class ScheduleDetailComponent {
  session: any;
  errors: string = null;
  speaker: any;
  modalSpeaker: any;
  @Input() _parent: any;
  @Input() agenda: any;
  @Input() speakerModal = false;
  @Input() speakerDetailComponent: any;
  @Input() optionTab: any;
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
  ) { 
  
      this.contactForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        message: ['', Validators.required],
        subject: ['', Validators.required]
      });

  }
  
  get f() { return this.contactForm.controls; }
  
  contactSendForm(form){
      
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
  
  ionViewWillEnter() {
    
    this.showSupportDetail = this.optionTab && this.optionTab === 'showSupportDetail';
    //this.showSupportDetail = true;
    
    const agenda = this.agenda;
    
    this.loading.present({message:'Cargando...'});
    
    this.fairsService.getCurrentFair().
    then( fair => {
        this.fair = fair;
    },error => {
        this.errors = error;
    });


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
        if(agenda.audience_config == 4) {
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
            email: [this.userDataSession.email, [Validators.required, Validators.email]],
            message: ['', Validators.required],
            subject: ['', Validators.required]
          });
      }
      else {
          this.contactForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required],
            subject: ['', Validators.required]
          });
          this.loading.dismiss();
          this.errors = null;
          this.loaded = true;
      }
    });
    
    const strDay = this.datepipe.transform(new Date(agenda.start_at), 'EEEE, MMMM d, y');
    const startTime = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
    const endTime = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
    const location = agenda.room ? agenda.room.name : '';
    
    this.session = agenda;
    this.session.strDay = strDay;
    this.session.startTime = startTime;
    this.session.endTime = endTime;
    this.session.location = location;
  }
  
  onSupportClick() {
     //     this.router.navigateByUrl('/support');
     //this.router.navigate(['/support'], {queryParams: {orgstructure: "Agenda", sessionId: this.session.id}});
     this.showSupportDetail = true;
  }

  onSpeaker(speaker) {
    if(!this.speakerModal) {
      this.presenterSpeakerModal(speaker);
    }
  }

  async presenterSpeakerModal(speaker) {
      
      
    this.modalSpeaker = await this.modalCtrl.create({
      component: this.speakerDetailComponent,
      cssClass: ['speaker-modal','boder-radius-modal'],
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
  
  onRegister () {
    this._parent.presenterLogin(); 
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
