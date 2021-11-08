import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { AgendasService } from './../../api/agendas.service';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { SpeakerDetailComponent } from '../speaker-list/speaker-detail/speaker-detail.component';
import { ModalController, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  defaultHref = '';
  errors: string = null;
  speaker: any;
  modalSpeaker: any;

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private agendasService: AgendasService,
    private datepipe: DatePipe,
    private router: Router,
    private loading: LoadingService,
    private routerOutlet: IonRouterOutlet,
    private modalCtrl: ModalController,
  ) { }
  
  ngDoCheck(){
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  ionViewWillEnter() {
    
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    this.loading.present({message:'Cargando...'});
    this.agendasService.get(sessionId)
     .then((agenda) => {
        this.loading.dismiss();
        this.errors = null;
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
        
        console.log(this.session);
        
    })
    .catch(error => {
       this.loading.dismiss();
       this.errors = error;
    });
    
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }
  
  onSupportClick() {
     //     this.router.navigateByUrl('/support');
     this.router.navigate(['/support'], {queryParams: {orgstructure: "Agenda", sessionId: this.session.id}});
  }

  async presenterSpeakerModal(speaker) {
      
    this.modalSpeaker = await this.modalCtrl.create({
      component: SpeakerDetailComponent,
      cssClass: 'speaker-modal',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { speaker: speaker }
    });
    await this.modalSpeaker.present();

    const { data } = await this.modalSpeaker.onWillDismiss();
  }
  
}
