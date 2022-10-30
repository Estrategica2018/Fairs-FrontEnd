import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../providers/loading.service';
import { AdminSpeakersService } from './../../../api/admin/speaker.service';
import { SpeakersService } from './../../../api/speakers.service';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FairsService } from './../../../api/fairs.service';
import { CategoryService } from './../../../api/category.service';
import { ModalController } from '@ionic/angular';
import { SpeakerAdminDetailComponent } from './speaker-admin-detail/speaker-admin-detail.component';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.page.html',
  styleUrls: ['./speaker.page.scss'],
})
export class SpeakerPage implements OnInit {
  speakers: any;
  speaker: any;
  errors: string;
  success: string;
  speakerTypeList = [];
  fair: any;
  file: any;
  uploadFileForm = false;
  modal: any;

  constructor(private adminSpeakersService: AdminSpeakersService, private speakersService: SpeakersService,
    private loading: LoadingService, private alertCtrl: AlertController,
    private router: Router, private route: ActivatedRoute,
    private fairsService: FairsService,
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {

    this.speaker = {
      id: null,
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

    this.fairsService.getCurrentFair()
      .then((fair) => {
        this.fair = fair;
        this.initSpeakerTypeList();
      });
  }

  ngDoCheck() {
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  async presentActionSpeaker(action: string) {

    this.success = null;
    this.errors = null;
    
    if (this.modal) { this.modal.dismiss(); }

    if(action == 'new') {
      this.new();
    }

    this.modal = await this.modalCtrl.create({
      component: SpeakerAdminDetailComponent,
      swipeToClose: false,
      cssClass: 'product-modal',
      componentProps: {
        'speaker': this.speaker,
        'speakerTypeList': this.speakerTypeList
      }
    });
    await this.modal.present();

    const { data } = await this.modal.onWillDismiss();
    if (data) {
      if (action == 'new') {
        this.store();
      }
      if (action == 'update') {
        this.update();
      }
    }
  }

  store() {

    this.loading.present({ message: 'Cargando...' });
    this.speaker.user_name = this.speaker.name.replace(' ', '') + '_' + Date.now();
    this.speaker.fair_id = this.fair.id;
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
  }

  get(speakerId) {
    this.loading.present({ message: 'Cargando...' });
    this.speakersService.get(speakerId).then((speaker) => {
      this.speaker = speaker;
      this.speaker.id = speaker.id;
      this.speaker.name = speaker.user.name;
      this.speaker.last_name = speaker.user.last_name;
      this.speaker.email = speaker.user.email;
      this.loading.dismiss();
      
      this.presentActionSpeaker('update');

    }).catch(error => {
      this.loading.dismiss();
      this.errors = error;
    });
  }
  update() {
    this.loading.present({ message: 'Cargando...' });
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
          }).catch(error => {
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
    this.loading.present({ message: 'Cargando...' });
    this.adminSpeakersService.delete({ id: speakerId })
      .then((speaker) => {
        this.speakersService.list().then((speakers) => {
          this.speakers = speakers;
          this.loading.dismiss();
          if (this.speakers.active) {
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
          }).catch(error => {
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
    this.speaker = {
      id: null,
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

  initSpeakerTypeList() {
    this.categoryService.list('SpeakerCategory', this.fair).then((response) => {
      if (response.success == 201) {
        this.speakerTypeList = [];

        for (let type of response.data) {
          this.speakerTypeList.push({ "type": type.name, "label": type.name });
        }
      }
      else {
        this.errors = `Consultando las categorias de conferencistas`;
      }
    });
  }

  onChangefile(event) {
    this.file = event.target.files[0];
  }

  onUploadSpeakerFile() {

    this.loading.present({ message: 'Cargando...' });
    this.uploadFileForm = false;
    this.errors = null;

    this.adminSpeakersService.uploadSpeakerFile(this.file)
      .then((response) => {
        this.speakersService.list().then((speakers) => {
          this.speakers = speakers;
          this.loading.dismiss();
          this.success = `Conferencistas actualizados exitosamente`;
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
}




