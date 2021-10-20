import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AlertController, ModalController,IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-imagen-list',
  templateUrl: './imagen-list.component.html',
  styleUrls: ['./imagen-list.component.scss'],
})
export class ImagenListComponent implements OnInit {

  @Input() parent: any;
  @Input() element: any;
  
  @Output() imageChanged = new EventEmitter<string>();
  
  constructor(private modalCtrl: ModalController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    
  }
  
  onCancel() {
    this.modalCtrl.dismiss();
  }
  
  async onNew() {
    const actionSheet = await this.alertCtrl.create({
      header: 'Url de la Imágen',
      message: "Ingresa la url de la imágen",
      inputs: [
        {
          name: 'url_image',
          value: '',
          placeholder: 'https://'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.parent[this.element].push({'url_image':data.url_image});
            this.imageChanged.emit();
          }
        }
      ]
    });
    await actionSheet.present();
    
    
  }
  async onDelete(parent,element,index) {
    parent[element] = this.parent[this.element].filter((image,key)=>{
        return key != index;
    });
    this.imageChanged.emit();
  }
  
  async onUpdate(index)  {
    const actionSheet = await this.alertCtrl.create({
      header: 'Url de la Imágen',
      message: "Ingresa la url de la imágen",
      inputs: [
        {
          name: 'url_image',
          value: this.parent[this.element][index].url_image,
          placeholder: ''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.parent[this.element][index].url_image  = data.url_image;
            this.imageChanged.emit();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  doReorderBanners(ev: any) {
    this.parent[this.element] = ev.detail.complete(this.parent[this.element]);
  } 

}
