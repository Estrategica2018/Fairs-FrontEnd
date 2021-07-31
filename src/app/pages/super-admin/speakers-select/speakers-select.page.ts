import { Component, OnInit, Input } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { AgendasService } from '../../../api/agendas.service';


@Component({
  selector: 'app-speakers-select',
  templateUrl: './speakers-select.page.html',
  styleUrls: ['./speakers-select.page.scss'],
})
export class SpeakersSelectPage implements OnInit {

  @Input() speakers: any;
  @Input() invited_speakers: any;
  @Input() meeting_id: any;
  @Input() fair_id: any;
  
  filterTerm: any;
  
  constructor(
    private modalCtrl: ModalController,
    private agendasService: AgendasService
  ) { }

  ngOnInit() {
      this.speakers.forEach((speaker, index, array)=>{
          if(this.invited_speakers) {
            this.invited_speakers.forEach((invited, index, array)=>{
               if(invited.speaker_id === speaker.id) {
                 speaker.isChecked = true;
               }
            });
          }
      });
  }

   
  onSave() {
    const list = this.speakers.filter((speaker)=>{
        return speaker.isChecked;
    });
    
    this.modalCtrl.dismiss(list);
  }
  
  onClose() {
    this.modalCtrl.dismiss(null);
  }
}
 