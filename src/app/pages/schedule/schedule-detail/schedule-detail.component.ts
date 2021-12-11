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
  @Input() speakerDetailComponent: any;
  userDataSession = null;
  loggedIn = false;
  profileRole= null;
  eventPayment = false;
  fair: any;
  loaded = false;
  showConfirmByProduct : any;
  
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
  ) { }
  
  ionViewWillEnter() {
    
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
      }
      else {
          this.loading.dismiss();
          this.errors = null;
          this.loaded = true;
      }
    });
    
    const strDay = this.datepipe.transform(new Date(agenda.start_at), 'EEEE, MMMM d, y');
    const startHour = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
    const endHour = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
    const location = agenda.room ? agenda.room.name : '';
        
    this.session = Object.assign({
      "strDay": strDay,
      "timeStart": startHour,
      "timeEnd": endHour,
      "location": location
    },agenda);
    
  }
  
  onSupportClick() {
     //     this.router.navigateByUrl('/support');
     this.router.navigate(['/support'], {queryParams: {orgstructure: "Agenda", sessionId: this.session.id}});
  }

  async presenterSpeakerModal(speaker) {
      
    this.modalSpeaker = await this.modalCtrl.create({
      component: this.speakerDetailComponent,
      cssClass: 'speaker-modal',
      swipeToClose: true,
      //presentingElement: this.routerOutlet.nativeEl,
      componentProps: { speaker: speaker }
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
  
  onBuyProduct() {
      this.loading.present({message:'Cargando...'});
      this.shoppingCartsService.addShoppingCart(this.fair, null, null, this.agenda, 1, this.userDataSession )
      .then((response) => {
        this.loading.dismiss();
        this.showConfirmByProduct = false;
        this.presentToast('Producto agredado exitósamente al carrito de compras', 'app-success-alert');
      })
      .catch(error => {
        this.loading.dismiss(); 
        this.presentToast('Ocurrió un error al agregar al carrito de compras: ['+ error +']', 'app-error-alert');
      });
  }

  async presentToast(msg,cssClass) {
    const toast = await this.toastCtrl.create({
      message: msg,
      cssClass: cssClass,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
 
}
