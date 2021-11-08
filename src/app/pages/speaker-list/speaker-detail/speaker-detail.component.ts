import { Component, OnInit } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { SpeakersService } from '../../../api/speakers.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.scss'],
})
export class SpeakerDetailComponent implements OnInit {

  speaker: any;
  months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  
  constructor(private navParams: NavParams,
  private speakersService: SpeakersService,
  private router: Router,
  private modalCtrl: ModalController) { }

  ngOnInit() {
    
  }
  
  ionViewWillEnter() {
    this.speaker = this.navParams.get('speaker');
    if(this.speaker.agenda) {
      this.speaker.agenda.forEach((agenda)=>{
        const time : any = agenda.start_at * 1000;
        agenda.str_start_time = this.months[<any>moment(time).format('MM') - 1] + ' ' + moment(time).format('DD') + ' ' + moment(time).format('YYYY');
      });
    }
    else {
        this.speakersService.get(this.speaker.id)
       .then((speaker) => {
          if(speaker.agenda) {
            this.speaker.agenda = speaker.agenda || [];
            this.speaker.agenda.forEach((agenda)=>{
              const time : any = agenda.start_at * 1000;
              agenda.str_start_time = this.months[<any>moment(time).format('MM') - 1] + ' ' + moment(time).format('DD') + ' ' + moment(time).format('YYYY');
            });
          }
       },error => {
          
       })
       .catch(error => {
       });
    }
  }
  
  onAgenda(agenda) {
    const url = "/schedule/session/"+agenda.id;
    if(this.modalCtrl) {
        this.modalCtrl.dismiss();
    }
    this.redirectTo(url);
  }
  
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }
  
}
