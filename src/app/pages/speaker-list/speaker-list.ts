import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { SpeakersService } from './../../api/speakers.service';
import { LoadingService } from './../../providers/loading.service';


@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = null;
  errors = null;

  constructor(
    private confData: ConferenceData,
    private loading: LoadingService,
    private speakersService: SpeakersService
  ) {}

 ngDoCheck(){
   document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
 }
 
  ionViewDidEnter() {
    
    this.loading.present({message:'Cargando...'});
    this.speakersService.list()
     .then((data) => {
        this.loading.dismiss();
        this.speakers = data;
     },error => {
        this.loading.dismiss();
        this.errors = `Consultando el servicio para conferencistas [${error}]`;
        console.log(error);
     })
     .catch(error => {
        this.loading.dismiss();
        this.errors = `Consultando el servicio para conferencistas [${error}]`;
        alert(error);
     });
  }
}
