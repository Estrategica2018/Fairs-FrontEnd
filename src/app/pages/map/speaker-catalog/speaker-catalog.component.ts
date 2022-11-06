import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common'
import { SpeakerDetailComponent } from '../../speaker-list/speaker-detail/speaker-detail.component';
import { ScheduleDetailComponent } from '../../schedule/schedule-detail/schedule-detail.component';

@Component({
  selector: 'app-speaker-catalog',
  templateUrl: './speaker-catalog.component.html',
  styleUrls: ['./speaker-catalog.component.scss'],
})
export class SpeakerCatalogComponent implements OnInit {

  @Input() bannerSpeakerSelectHover;
  @Input() banner;
  @Input() showSpeakerCatalogActions;
  @Input() tabSelect;

  modal: any;
  speakerDetailComponent = SpeakerDetailComponent;

  constructor(private datepipe: DatePipe,
    private modalCtrl: ModalController) {
  }

  ngOnInit() {
    
  }


  async presenterSpeakerModal(speaker) {
    this.modal = await this.modalCtrl.create({
      component: this.speakerDetailComponent,
      cssClass: 'speaker-modal',
      swipeToClose: true,
      backdropDismiss: false,
      componentProps: { speaker: speaker, scheduleMode: true }
    });
    await this.modal.present();

    const { data } = await this.modal.onWillDismiss();
  }

  goToOnHoverBanner(banner, col, row, scene){}
}
