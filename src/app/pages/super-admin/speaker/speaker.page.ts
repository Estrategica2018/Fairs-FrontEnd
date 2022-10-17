import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../providers/loading.service';
import {AdminSpeakersService} from './../../../api/admin/speaker.service';
import {SpeakersService} from './../../../api/speakers.service';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute} from '@angular/router';
import { FairsService } from './../../../api/fairs.service';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.page.html',
  styleUrls: ['./speaker.page.scss'],
})
export class SpeakerPage implements OnInit {
  speakers: any;
  speaker: any;
  errors: string = null;
  success: string = null;

  constructor( private adminSpeakersService: AdminSpeakersService, private speakersService: SpeakersService,
               private loading: LoadingService, private alertCtrl: AlertController,
               private router: Router, private route: ActivatedRoute,
               private fairsService: FairsService,
  ) { }
  ngOnInit() {
    this.speaker =  {
      id: null ,
      name: '',
      user_name: '',
      last_name: '',
      profile_picture: '',
      company_logo: '',
      description_one: '',
      description_two: '',
      position: '',
      profession: '',
      email: '',
      active: '',
    };
    this.speakersService.list().then((speakers) => {
      this.speakers = speakers;
    });
  }

  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  store() {

    this.loading.present({message: 'Cargando...'});
    this.speaker.user_name = this.speaker.name.replace(' ', '' ) + '_' + Date.now(),
    this.fairsService.getCurrentFair()
      .then((fair) => {

        this.speaker.fair_id = fair.id;
        this.speaker.origin = window.location.origin;
        this.adminSpeakersService.create(this.speaker)
          .then((speaker) => {
        this.speakersService.list().then((speakers) => {
          this.speakers = speakers;
          this.loading.dismiss();
          this.success = `Conferencista creado exitosamente`;
          this.errors = null;
          this.speaker = speaker;
        });
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
      });
  }
  get(speakerId) {
    this.loading.present({message: 'Cargando...'});
    this.speakersService.get(speakerId).then((speaker) => {
      this.speaker = speaker;
      this.speaker.id = speaker.id;
      this.speaker.name = speaker.user.name;
      this.speaker.last_name = speaker.user.last_name;
      this.speaker.email = speaker.user.email;
      this.loading.dismiss();
      this.success = `Conferencista consultado`;
    } ).catch(error => {
      this.loading.dismiss();
      this.errors = error;
    });
  }
  update() {
    this.loading.present({message: 'Cargando...'});
    this.adminSpeakersService.update(this.speaker)
      .then((speaker) => {
        this.speakersService.list().then((speakers) => {
          this.speakers = speakers;
          this.loading.dismiss();
          this.success = `Conferencista actualizado exitosamente`;
          this.errors = null;
          this.speaker = speaker;
          this.speakersService.get(speaker.id).then((speakerGet) => {
            this.speaker = speakerGet;
            this.speaker.id = speakerGet.id;
            this.speaker.name = speakerGet.user.name;
            this.speaker.last_name = speakerGet.user.last_name;
            this.speaker.email = speakerGet.user.email;
          } ).catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
        }).catch(error => {
          this.loading.dismiss();
          this.errors = error;
        });
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });
  }
  delete(speakerId) {
    this.loading.present({message: 'Cargando...'});
    this.adminSpeakersService.delete({ id: speakerId })
      .then((speaker) => {
        this.speakersService.list().then((speakers) => {
          this.speakers = speakers;
          this.loading.dismiss();
          if ( this.speakers.active ) {
            this.success = `Conferencista activado exitosamente`;
          } else {
            this.success = `Conferencista inactivado exitosamente`;
          }
          this.errors = null;
          this.speaker = speaker;
          this.speakersService.get(speaker.id).then((speakerGet) => {
            this.speaker = speakerGet;
            this.speaker.id = speakerGet.id;
            this.speaker.name = speakerGet.user.name;
            this.speaker.last_name = speakerGet.user.last_name;
            this.speaker.email = speakerGet.user.email;
          } ).catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
        }).catch(error => {
          this.loading.dismiss();
          this.errors = error;
        });
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });
  }
  new() {
    this.speaker =  {
      id: null ,
      name: '',
      user_name: '',
      last_name: '',
      profile_picture: '',
      company_logo: '',
      description_one: '',
      description_two: '',
      position: '',
      profession: '',
      email: '',
      active: '',
    };
  }
}
