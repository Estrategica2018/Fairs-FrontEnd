import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { UsersService } from '../../api/users.service';
import { LoadingService } from './../../providers/loading.service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  
  userData: any;
  onChangeImag = false;
  keyUpdate: string = null;
  objectUpdate: string = null;
  errors: string = null;
  url_image: string = null;

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private loading: LoadingService,
    private usersService: UsersService
  ) { }

  ngAfterViewInit() {
    this.getUser();
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.onChangeImag = true;
        this.url_image = event.target.result;
        this.updateImage();
      }
    }
  }
  
  async updateImage() {
    const alert = await this.alertCtrl.create({
      header: 'Confirma para cambiar la imagen',
      message: `<img src="${this.url_image}" class="card-alert">`,
      buttons: [
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            this.keyUpdate = 'image';
            this.objectUpdate = this.url_image;
            this.onUpdateUser();
          }
        }
      ]
    });
    await alert.present();
  }



  async changeName() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar Nombre',
      buttons: [
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            this.keyUpdate = 'name';
            this.objectUpdate = data[this.keyUpdate];
            this.onUpdateUser();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'name',
          value: this.userData.name,
          placeholder: 'Nombre'
        }
      ]
    });
    await alert.present();
  }

  async changeLastName() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar Apellido',
      buttons: [
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            this.keyUpdate = 'last_name';
            this.objectUpdate = data[this.keyUpdate];
            this.onUpdateUser();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'last_name',
          value: this.userData.last_name,
          placeholder: 'apellido'
        }
      ]
    });
    await alert.present();
  }
  getUser() {
    this.usersService.getUser().then((userData) => {
      this.userData = userData;
    });
  }

  changePassword() {
    
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/login');
  }

  support() {
    this.router.navigateByUrl('/support');
  }
  
  
  onUpdateUser() {
    
    this.loading.present({message:'Cargando...'});
    const dt = {};
    this.errors = null;
    dt[this.keyUpdate] = this.objectUpdate;
    this.usersService.getUser().then((userDataSession: any)=>{
       this.usersService.updateUser(userDataSession,dt)
       .subscribe(
        data => {
            
            this.loading.dismiss();
            if(data.success == 201 ) {
              this.userData = Object.assign(dt,data.data);
              this.userData = Object.assign({token:userDataSession.token},data.data);
              this.usersService.setUser(this.userData).then((data) => {
                console.log('guardado Exitosamente',data);
              });
            }
            else { this.errors = "actualizando los datos"; }
            
        },
        error => {
            this.loading.dismiss();
            this.errors = error;
      });
    });
  }
}
