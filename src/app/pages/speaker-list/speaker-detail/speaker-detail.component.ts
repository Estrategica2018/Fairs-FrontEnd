import { Component, OnInit, Input } from '@angular/core';
import { HostListener } from "@angular/core";
import { Config, ModalController, NavParams } from '@ionic/angular';
import { SpeakersService } from '../../../api/speakers.service';
import { AgendasService } from '../../../api/agendas.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ScheduleDetailComponent } from '../../schedule/schedule-detail/schedule-detail.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.scss'],
})
export class SpeakerDetailComponent implements OnInit {

  speaker: any;
  months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  days = ['Día 7 - Domingo','Día 1 - Lunes', 'Día 2 - Martes', 'Día 3 - Miercoles', 'Día 4 - Jueves', 'Día 5 - Viernes', 'Día 6 - Sábado'];
  screenSm = false;
  @Input() scheduleMode = false;
  stretchMore = true;


  constructor(
    private navParams: NavParams,
    private speakersService: SpeakersService,
    private router: Router,
    private modalCtrl: ModalController,
    private agendasService: AgendasService,
    private datepipe: DatePipe,) { }

  ngOnInit() {
    this.onResize();
  }

  ionViewWillEnter() {
    this.speaker = this.navParams.get('speaker');

    this.speakersService.get(this.speaker.id)
      .then((speaker) => {
        if (speaker.agenda) {
          this.speaker.agenda = speaker.agenda || [];
          this.speaker.agenda.forEach((agenda) => {

            agenda.start_at = agenda.start_at * 1000;
            agenda.duration_time *= 60 * 1000;


            const timeZone = moment(agenda.start_at);
            const strHour = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
            const endHour = moment(agenda.start_at).add(agenda.duration_time, 'milliseconds').format('hh:mm a');
            agenda.startHour = strHour ;
            agenda.endTime = endHour;






/*
            const time: any = agenda.start_at * 1000;
            
            const timeZone = moment(time);
            const dayOfWek = this.days[timeZone.day()];
            const month = Number(timeZone.format('MM'));
            const strDay = timeZone.format('DD');
            agenda.str_start_time = dayOfWek + ' '  + strDay + ' de ' + this.months[month - 1];

            agenda.startHour = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
            agenda.endTime = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');*/
          });
        }
      }, error => {

      })
      .catch(error => {
      });

  }

  onAgenda(agenda) {
    if (!this.scheduleMode) {

      this.agendasService.get(agenda.id, false)
        .then((agenda) => {
          this.presenterAgendaModal(agenda);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  async presenterAgendaModal(agenda) {

    const modal = await this.modalCtrl.create({
      component: ScheduleDetailComponent,
      cssClass: ['agenda-modal', 'boder-radius-modal'],
      componentProps: {
        '_parent': this,
        'agenda': agenda,
        'speakerDetailComponent': this,
        'type': 'Agenda',
        'speakerModal': true
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
    }
  }

  redirectTo(uri: string) {
    this.closeModal();
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenSm = window.outerWidth < 590;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }


}
