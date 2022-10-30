import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-speaker-admin-detail',
  templateUrl: './speaker-admin-detail.component.html',
  styleUrls: ['./speaker-admin-detail.component.scss'],
})
export class SpeakerAdminDetailComponent implements OnInit {

  @Input() speaker;
  @Input() speakerTypeList;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  
  }

  new(){
    this.modalCtrl.dismiss({
      'speaker': this.speaker
     });
  } 

  update(){
    this.modalCtrl.dismiss({
      'speaker': this.speaker
     });
  } 

  close(){
    this.modalCtrl.dismiss(null);
  } 


}