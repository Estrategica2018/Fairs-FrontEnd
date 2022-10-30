import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.scss'],
})
export class SpeakerListComponent implements OnInit {

  @Input() catalogList;
  @Input() allElementList;
  categorySelected: string;
  elementList = [];

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.onChangeItem();
  }


  dismissModal() {
    this.modalCtrl.dismiss(null);
  }

  acceptModal() {
    this.modalCtrl.dismiss({ "categorySelected": this.categorySelected, "elementList": this.elementList });
  }

  onChangeItem() {
    this.elementList = [];
    for (let speaker of this.allElementList) {
      if (this.categorySelected == null || this.categorySelected == speaker.position) {
        this.elementList.push(speaker);
      }
    }
  }

}
