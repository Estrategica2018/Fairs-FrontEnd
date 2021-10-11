import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../providers/loading.service';
import {AdminSpeakersService} from './../../../api/admin/speaker.service';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute} from '@angular/router';
import { FairsService } from './../../../api/fairs.service';

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
               private alertCtrl: AlertController, private router: Router, private route: ActivatedRoute,
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
    };
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
			this.loading.dismiss();
			this.success = `Conferencista creado exitosamente`;
			this.errors = null;
			this.speaker = speaker;
			console.log(speaker, 'creación');
		  })
		  .catch(error => {
			this.loading.dismiss();
			this.errors = error;
		  });
	  });
  }
}
