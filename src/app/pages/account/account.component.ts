import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsersService } from '../../api/users.service';
import { LoadingService } from './../../providers/loading.service';
import { environment, SERVER_URL } from '../../../environments/environment';
import { LoginComponent } from '../login/login.component';
import { ToastController, ModalController } from '@ionic/angular';
import Cropper from 'cropperjs';
import Croppie from 'croppie';
import { Cloudinary } from '@cloudinary/angular-5.x';


declare var cloudinary: any;

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountComponent implements AfterViewInit {
  

  userData: any;
  showChangeImageBtn = false;
  keyUpdate: string = null;
  objectUpdate: string = null;
  errors: string = null;
  url_image: string = null;
  modal: any;
  showEdit = false;
  showEditPhoto = false;
  
  imageCropper: any;
  cropper: any;
  vanilla: any;
  myWidgetFalse;
  
  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private toastCtrl: ToastController,
    private loading: LoadingService,
    private usersService: UsersService,
    private modalCtrl: ModalController,
  ) { }
  
  ngDoCheck(){
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  ngAfterViewInit() {
    this.getUser();
    this.myWidgetFalse = cloudinary.createUploadWidget(
      {
        cloudName: "deueufyac",
        uploadPreset: "angular_cloudinary",
        showAdvancedOptions: true,
        multiple: false,
        sources: [ 'local', 'url'],
        folder: 'sublimacion/locales/saeta', 
        cropping: true
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          this.keyUpdate = 'url_image';
          this.objectUpdate = result.info.secure_url;
          this.onUpdateUser();
        }
      }
    );

  }
  
  ngOnDestroy(): void {
     if(this.modal) { this.modal.dismiss(); }
  }

  onSelectFile(event) {
    this.myWidgetFalse.open();
  }
  
  onSelectFileLocal(event) {
    this.showEditPhoto = true;  
    const _self = this;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      /*reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.showChangeImageBtn = true;
        this.url_image = event.target.result;
        this.updateImage();
      }*/
        
        
        reader.onload = function(evt: any) {
           
           _self.url_image = evt.target.result;
           //const img = new Image();
           const imageCropper = document.querySelector<HTMLImageElement>('#image');
           //const context = document.querySelector('#canvas').getContext("2d");
           imageCropper.src = evt.target.result;
             //context.canvas.height = img.height;
             //context.canvas.width  = img.width;
             //context.drawImage(img, 0, 0);
             
           _self.showChangeImageBtn = true;
           
           imageCropper.onload = function() {
            //_self.cropper = new Cropper(imageCropper, {
            //  aspectRatio: 9 / 9,
            //  autoCropArea: 1,
            //  cropend(evtCr) {
            //    //_self.url_image = evtCr.currentTarget.cropper.crossOriginUrl;
            //    _self.url_image = imageCropper.getCroppedCanvas().toDataURL("image/png");
            //  },
            //});
            
            
            _self.vanilla = new Croppie(imageCropper, {
                viewport: { width: 200, height: 200 },
                boundary: { width: 300, height: 300 },
                showZoomer: true
                
                
            });
            _self.vanilla.bind({
                url: 'demo/demo-2.jpg',
                orientation: 4
            });
            //on button click
            _self.vanilla.result('base64').then(function(blob) {
                // do something with cropped blob
                console.log(blob);
            });
             
             //$('#btnCrop').click(function() {
             //   // Get a string base 64 data url
             //   var croppedImageDataURL = canvas.cropper('getCroppedCanvas').toDataURL("image/png"); 
             //   $result.append( $('<img>').attr('src', croppedImageDataURL) );
             //});
             //$('#btnRestore').click(function() {
             //  canvas.cropper('reset');
             //  $result.empty();
             //});
           };
        };
        
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
      if(userData) {     
        this.userData = userData;
        this.url_image =  this.userData.url_image;
      }
    });
  }

  changePassword() {
    
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
            
            if(data.success == 201 ) {
              this.userData.url_image = data.data.url_image;
              this.userData.name = data.data.name;
              this.userData.last_name = data.data.last_name;
              this.url_image = data.data.url_image;
              this.usersService.setUser(this.userData).then((data) => {
                this.presentToast('Registro guardado exitosamente');
              });
              this.loading.dismiss();
            }
            else { 
              this.errors = "Error actualizando los datos"; 
              this.presentToast(this.errors);
              this.loading.dismiss();
            }
        },
        error => {
            this.loading.dismiss();
            this.errors = error;
            this.presentToast(this.errors);
      });
    });
  }
  
  async presentLogout() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Confirma para cerrar la sesión',
      buttons: [
        { text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: (data: any) => {
             this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.loading.present({message:'Cargando...'});
    this.usersService.getUser().then(userDataSession=>{
        if(userDataSession) {
            this.usersService.logout(userDataSession)
            .subscribe(
              data => {
                this.loading.dismiss();
                
                this.usersService.setUser(null).then(() => {
                  window.dispatchEvent(new CustomEvent('user:logout'));
                  //this.router.navigateByUrl(`/schedule`);
                });
                
              },
              error => {
                this.loading.dismiss();
                this.errors = error;
                this.usersService.setUser(null).then(() => {
                  window.dispatchEvent(new CustomEvent('user:logout'));
                  //this.router.navigateByUrl(`/schedule`);
                });

             }
            ); 
        }
        else {
            this.loading.dismiss();
            this.errors = null;
            this.usersService.setUser(null).then(() => {
              window.dispatchEvent(new CustomEvent('user:logout'));
              //this.router.navigateByUrl(`/schedule`);
            });
        }
    });
  }
  
  async presenterRecovery() {
    
    //if(this.modal) { this.modal.dismiss(); }
    
    this.modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this,
        'showMenu': 'recovery',
        'email_recovery': this.userData.email
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  } 
  
  closeModal() {
    this.modalCtrl.dismiss();
  }

  onCropperImage() {
    //this.url_image = event.currentTarget.cropper.crossOriginUrl;
    const _self = this;
    this.showEditPhoto = false;
    this.vanilla.result('base64').then(function(blob) {
        // do something with cropped blob
        _self.url_image = blob;
        _self.updateImage();
    });
  }
  

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });  
    toast.present();
  }
}
