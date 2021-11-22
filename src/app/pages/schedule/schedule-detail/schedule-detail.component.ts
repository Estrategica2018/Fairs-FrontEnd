import { Component, Input } from '@angular/core';

import { ConferenceData } from '../../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../../providers/user-data';
import { AgendasService } from '../../../api/agendas.service';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';
import { LoadingService } from '../../../providers/loading.service';
import { SpeakerDetailComponent } from '../../speaker-list/speaker-detail/speaker-detail.component';
import { ModalController } from '@ionic/angular';

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
  @Input() agenda: any;
  @Input() speakerDetailComponent: any;

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private agendasService: AgendasService,
    private datepipe: DatePipe,
    private router: Router,
    private loading: LoadingService,
    //private routerOutlet: IonRouterOutlet,
    private modalCtrl: ModalController,
  ) { }
  
  ionViewWillEnter() {
    const agenda = this.agenda;
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
}
