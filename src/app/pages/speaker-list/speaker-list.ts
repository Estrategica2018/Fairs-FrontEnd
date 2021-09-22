import { Component,ViewChildren} from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { SpeakersService } from './../../api/speakers.service';
import { LoadingService } from './../../providers/loading.service';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { SpeakerDetailComponent } from './speaker-detail/speaker-detail.component';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = null;
  errors = null;
  modalSpeaker: any;
  @ViewChildren('cards') cards: any;

  constructor(
    private confData: ConferenceData,
    private loading: LoadingService,
    private speakersService: SpeakersService,
    private modalCtrl: ModalController, 
    private routerOutlet: IonRouterOutlet,
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
     })
     .catch(error => {
        this.loading.dismiss();
        this.errors = `Consultando el servicio para conferencistas [${error}]`;
     });
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
