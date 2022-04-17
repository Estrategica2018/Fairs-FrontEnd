import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../providers/loading.service';
import { AdminMerchantsService } from './../../../api/admin/merchant.service';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.page.html',
  styleUrls: ['./merchant.page.scss'],
})
export class MerchantPage implements OnInit {
  merchant: any;
  errors: string = null;
  success: string = null;
  editSave: any;

  constructor( private adminMerchantsService: AdminMerchantsService, private loading: LoadingService,
               private alertCtrl: AlertController, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.merchant =  {
      id: null ,
      nick: '',
      name: '',
      resources: {url_image: '' },
      social_media: {},
      location: '',
      name_contact: '',
      email_contact: '',
    };
    const merchantId = this.route.snapshot.paramMap.get('merchantId');
    if ( merchantId != null ) {
      this.loading.present({message: 'Cargando...'});
      this.adminMerchantsService.get( {id: merchantId} )
        .then((merchant) => {
          this.merchant = merchant;
          this.loading.dismiss();
        })
        .catch(error => {
          this.loading.dismiss();
          this.errors = error;
        });
    }
  }
  store() {

    this.loading.present({message: 'Cargando...'});
    this.adminMerchantsService.create(this.merchant)
      .then((merchant) => {
        this.loading.dismiss();
        this.success = `Comercio creado exitosamente`;
        this.errors = null;
        this.merchant = merchant;
        
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });

  }

  update() {

    this.loading.present({message: 'Cargando...'});
    this.adminMerchantsService.update(this.merchant)
      .then((merchant) => {
        this.loading.dismiss();
        this.success = `Comercio modificado exitosamente`;
        this.errors = null;
        this.merchant = merchant;
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });

  }
  async presentActionIcons() {
    const actionAlert = await this.alertCtrl.create({
      header: 'Redes sociales del comercio',
      message: 'Ingresa las Url de las redes sociales del comercio',
      inputs: [{
        name: 'url_facebook',
        label: 'Url Facebook',
        value: this.merchant.social_media.url_facebook,
        placeholder: 'facebook'
      }, {
        name: 'url_instagram',
        label: 'Url Instagram',
        value: this.merchant.social_media.url_instagram,
        placeholder: 'Instagram'
      }, {
        name: 'url_youtube',
        label: 'Url Youtube',
        value: this.merchant.social_media.url_youtube,
        placeholder: 'Youtube'
      }, {
        name: 'url_whatsapp',
        label: 'Url Whatsapp',
        value: this.merchant.social_media.url_whatsapp,
        placeholder: 'Whatsapp'
      }, {
        name: 'url_twitter',
        label: 'Url Twitter',
        value: this.merchant.social_media.url_twitter,
        placeholder: 'Twitter'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Guardar',
        role: 'destructive',
        handler: (data) => {
          this.editSave = true;
          this.merchant.social_media.url_facebook = data.url_facebook;
          this.merchant.social_media.url_instagram = data.url_instagram;
          this.merchant.social_media.url_youtube = data.url_youtube;
          this.merchant.social_media.url_whatsapp = data.url_whatsapp;
          this.merchant.social_media.url_twitter = data.url_twitter;

        }
      }]
    });
    await actionAlert.present();

  }
}
