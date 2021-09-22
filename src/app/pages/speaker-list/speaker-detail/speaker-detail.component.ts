import { Component, OnInit } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.scss'],
})
export class SpeakerDetailComponent implements OnInit {

  speaker: any;
  months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  
  constructor(private navParams: NavParams) { }

  ngOnInit() {
    
  }
  
  ionViewWillEnter() {
    this.speaker = this.navParams.get('speaker');
    if(this.speaker.agenda)
    this.speaker.agenda.forEach((agenda)=>{
        const time : any = agenda.start_at * 1000;
        agenda.str_start_time = this.months[<any>moment(time).format('MM') - 1] + ' ' + moment(time).format('DD') + ' ' + moment(time).format('YYYY');
    });
  }
}
