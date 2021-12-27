import { Component, OnInit, Input } from '@angular/core';
import { HostListener } from "@angular/core";
import { Config, ModalController, NavParams } from '@ionic/angular';
import { SpeakersService } from '../../../api/speakers.service';
import { AgendasService }  from '../../../api/agendas.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ScheduleDetailComponent } from '../../schedule/schedule-detail/schedule-detail.component';

@Component({
  selector: 'app-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.scss'],
})
export class SpeakerDetailComponent implements OnInit {

  speaker: any;
  months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  screenSm = false;
  @Input() scheduleMode = false;
  
  
  constructor(
  private navParams: NavParams,
  private speakersService: SpeakersService,
  private router: Router,
  private modalCtrl: ModalController,
  private agendasService: AgendasService) { }

  ngOnInit() {
    this.onResize();
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
	if(!this.scheduleMode) {
		
		this.agendasService.get(agenda.id)
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
	  cssClass: 'agenda-modal',
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

	if(data) {
	}

      

  }

  
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
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
