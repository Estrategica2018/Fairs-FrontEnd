import { Component } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;
  deselectAll: boolean = false;

  tracks: {name: string, icon: string, isChecked: boolean}[] = [];

  constructor(
    private confData: ConferenceData,
    private config: Config,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;

    // passed in array of track names that should be excluded (unchecked)
    this.tracks = this.navParams.get('categories');
  }

  selectAll(check: boolean) {
    // set all to checked or unchecked
    this.tracks.forEach(track => {
      track.isChecked = check;
    });
    this.deselectAll = !check;
  }

  applyFilters() {
    let list = this.tracks.filter(c => c.isChecked);
    if(list.length === 0) {
        this.presentAlert('Debe seleccionar por lo menos una categoría');
        return ;
    }
    // Pass back a new array of categories to exclude
    this.dismiss(this.tracks);
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }
  
  async presentAlert(header) {
    const alert = await this.alertController.create({
      subHeader: header
    });

    await alert.present();
  }
}
