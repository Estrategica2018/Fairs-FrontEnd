import { Component, Input, OnInit } from '@angular/core';
import {  ModalController } from '@ionic/angular';
import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common'
import { SpeakerDetailComponent } from '../../speaker-list/speaker-detail/speaker-detail.component';
import { ScheduleDetailComponent } from '../../schedule/schedule-detail/schedule-detail.component';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-agenda-catalog',
  templateUrl: './agenda-catalog.component.html',
  styleUrls: ['./agenda-catalog.component.scss'],
})
export class AgendaCatalogComponent implements OnInit {

  @Input() group;
  @Input() banner;
  modal: any;
  speakerDetailComponent = SpeakerDetailComponent;

  constructor(private datepipe: DatePipe,
    private modalCtrl: ModalController) { 
  }

  ngOnInit() {
    
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

  
  }

}
