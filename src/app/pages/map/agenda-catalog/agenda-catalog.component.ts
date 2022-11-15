import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common'
import { SpeakerDetailComponent } from '../../speaker-list/speaker-detail/speaker-detail.component';
import { ScheduleDetailComponent } from '../../schedule/schedule-detail/schedule-detail.component';
import { LoginComponent } from '../../login/login.component';
import { AgendasService } from 'src/app/api/agendas.service';

@Component({
  selector: 'app-agenda-catalog',
  templateUrl: './agenda-catalog.component.html',
  styleUrls: ['./agenda-catalog.component.scss'],
})
export class AgendaCatalogComponent implements OnInit {


  @Input() banner;
  modal: any;
  speakerDetailComponent = SpeakerDetailComponent;

  constructor(private datepipe: DatePipe,
    private modalCtrl: ModalController,
    private agendasService: AgendasService) {
  }

  ngOnInit() {
    this.banner.__agendaCatalogList = { "agendas": [], "groups": [] };
    this.initializeAgendaCatalogs(this.banner);
  }


  async openAgenda(session) {

    this.modal = await this.modalCtrl.create({
      component: ScheduleDetailComponent,
      cssClass: ['agenda-modal', 'boder-radius-modal'],
      componentProps: {
        '_parent': this,
        'agenda': session,
        'speakerDetailComponent': this.speakerDetailComponent,
        'type': 'Agenda'
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if (data) {
    }
  }

  async presenterLogin() {

    //if(this.modal) { this.modal.dismiss(); }

    this.modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if (data) {
    }
  }



  initializeAgendaCatalogs(banner) {

    banner.__factor = 3;
    banner.__agendaCatalogList.agendas = [];
    this.agendasService.list(null)
      .then((agendas) => {
        if (agendas.length > 0) {
          agendas.forEach((agenda) => {

            for (let cat of banner.agendaCatalog.category.split(',')) {
              if (cat == 'all' || agenda.category.name == cat) {
                banner.__agendaCatalogList.agendas.push(Object.assign({}, agenda));
              }
            }
          });
          banner.__agendaCatalogList.groups = [];
          this.transformSchedule(banner);
        }
        //this.resizeAgendaCatalogs(banner);
      })
      .catch(error => {
        console.log(error);
      });
  }


  transformSchedule(banner) {

    const months = ['Ene', 'Feb', 'Marzo', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const days = ['Día 7 - Domingo', 'Día 1 - Lunes', 'Día 2 - Martes', 'Día 3 - Miércoles', 'Día 4 - Jueves', 'Día 5 - Viernes', 'Día 6 - Sábado'];
    let groups = null;
    let agendas = null;

    groups = banner.__agendaCatalogList.groups;
    agendas = banner.__agendaCatalogList.agendas;

    for (let agenda of agendas) {

      const timeZone = moment(agenda.start_at);
      const dayOfWek = days[timeZone.day()];

      const strHour = this.datepipe.transform(new Date(agenda.start_at), 'hh');
      const strMinutes = timeZone.format('mm');

      const time = timeZone.format('YYYY-MM-DD');
      const month = Number(timeZone.format('MM'));
      const strSignature = Number(timeZone.format('HH')) > 12 ? 'PM' : 'AM';
      const strYear = timeZone.format('YYYY');
      const strMonth = months[month - 1];
      const strDay = timeZone.format('DD');

      let groupTemp = null;
      for (let group of groups) {
        if (group.time === time) {
          groupTemp = group;
          break;
        }
      }
      if (!groupTemp) {
        groupTemp = {
          time: time,
          strDay: strDay,
          month: dayOfWek,
          //month: dayOfWek + ' ' + strMonth + ' ' + strYear,
          sessions: []
        };
        groups.push(groupTemp);
      }

      const endHour = moment(agenda.start_at).add(agenda.duration_time, 'milliseconds').format('hh:mm a');

      const location = agenda.room ? agenda.room.name : '';

      groupTemp.sessions.push(
        Object.assign({
          name: agenda.title,
          startTime: strHour + ':' + strMinutes,
          endTime: endHour,
          time: time,
          hour: strHour,
          minutes: strMinutes,
          signature: strSignature,
          month: dayOfWek,
          //month: dayOfWek + ' ' + strMonth + ' ' + strYear,
          location: location,
        }, agenda));
    }

  }
}
