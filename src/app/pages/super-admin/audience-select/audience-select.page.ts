import { Component, OnInit, Input } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { AgendasService } from '../../../api/agendas.service';
import { ReversePipe } from 'ngx-pipes';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-audience-select',
  templateUrl: './audience-select.page.html',
  styleUrls: ['./audience-select.page.scss'],
  providers: [ReversePipe]
})
export class AudienceSelectPage implements OnInit {

  @Input() audiences: any;
  @Input() invited_emails: any;
  @Input() meeting_id: any;
  @Input() fair_id: any;

  filterTerm: any;

  constructor(
    private modalCtrl: ModalController, 
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.audiences.forEach((audience, index, array) => {
      audience.checked = audience.check == 1;
    });
  }


  onSave() {
    /*audienceEmails = this.audiences.filter((audience)=>{
      return audience.status;
    });*/

    this.modalCtrl.dismiss(this.audiences);
  }

  readSingleFile(e) {
    const file = e.target.files[0];
    const _self = this;
    if (!file) {
      return;
    }
    var reader = new FileReader();


    reader.onload = function (fre: any) {
      var contents = fre.target.result.split('\n');

      function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
      }

      contents.forEach((email) => {
        if (validateEmail(email)) {
          _self.audiences.push({ check: 1, checked: true, email: email });
        }
      })
    };
    reader.readAsText(file);
  }

  async presentAddEmail() {
    const alert = await this.alertCtrl.create({
      header: 'Adiciona un correo a la lista',
      buttons: [
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            const email = data['email'];
            this.audiences.push({ check: 1, checked: true, email: email });
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'email',
          value: '',
          placeholder: 'Correo Electrónico'
        }
      ]
    });
    await alert.present();
  }

  onLoadInputClick() {
    let element: HTMLElement = document.querySelector<HTMLElement>('#uploadInput') as HTMLElement;
    element.click();
  }
}


