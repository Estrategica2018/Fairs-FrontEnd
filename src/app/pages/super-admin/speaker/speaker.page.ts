import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../providers/loading.service';
import {AdminSpeakersService} from './../../../api/admin/speaker.service';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.page.html',
  styleUrls: ['./speaker.page.scss'],
})
export class SpeakerPage implements OnInit {
  speaker: any;
  errors: string = null;
  success: string = null;
  constructor( private adminSpeakersService: AdminSpeakersService, private loading: LoadingService,
               private alertCtrl: AlertController, private router: Router, private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.speaker =  {
      id: null ,
      name: '',
      profile_picture: '',
      company_logo: '',
      description_one: '',
      description_two: '',
      position: '',
      profession: '',
      email: '',
    };
  }
  store() {

    this.loading.present({message: 'Cargando...'});
    this.adminSpeakersService.create(this.speaker)
      .then((merchant) => {
        this.loading.dismiss();
        this.success = `Conferencista creado exitosamente`;
        this.errors = null;
        this.speaker = merchant;
        console.log(merchant, 'creación');
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });

  }
}
