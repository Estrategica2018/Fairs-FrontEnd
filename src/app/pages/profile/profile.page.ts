import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/api/users.service';
import { LoadingService } from 'src/app/providers/loading.service';
import Cropper from 'cropperjs';
import Croppie from 'croppie';
//import { Cloudinary,  } from '@cloudinary/angular-5.x';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { HttpClient } from '@angular/common/http';

import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

declare var cloudinary: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  errors: string = null;
  sucess: string = null;
  userData: any = {};
  url_image: any = null;
  rolName: string;
  imageForm: any = {};
  showEditPhoto = false;
  showEdit = false;
  showChangeImageBtn = false;
  keyUpdate: string = null;
  objectUpdate: string = null;
  modal: any;

  imageCropper: any;
  cropper: any;
  vanilla: any;
  myWidgetFalse;
  language: any;

  @ViewChild("imageBack", { read: ElementRef }) private imageBack: ElementRef;

  constructor(private alertCtrl: AlertController,
    private router: Router,
    private toastCtrl: ToastController,
    private loading: LoadingService,
    private usersService: UsersService,
    private http: HttpClient,
    private modalCtrl: ModalController) {

    this.http.get('assets/cloudinary/es.json', { responseType: 'json' })
      .subscribe(data => {
        this.language = data;
        this.initializeCloundinary();
      });

  }

  ngDoCheck() {
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  ngOnInit() {

    console.log(this.language);

    this.getUser();
    this.listenForFullScreenEvents();
    this.initializeCloundinary();
  }

  initializeCloundinary() {
    const ratio = 0.8;
    this.myWidgetFalse = cloudinary.createUploadWidget(
      {
        cloudName: "deueufyac",
        uploadPreset: "angular_cloudinary",
        showAdvancedOptions: true,
        multiple: false,
        sources: ['local', 'url'],
        folder: 'sublimacion/locales/saeta',
        cropping: true,
        ///showSkipCropButton: true,
        croppingAspectRatio: ratio,
        croppingDefaultSelectionRatio: ratio,
        croppingShowDimensions: ratio,
        //croppingShowBackButton: true,
        language: "es",
        text: this.language

      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          this.keyUpdate = 'url_image';
          this.objectUpdate = result.info.thumbnail_url;
          const path = result.info.path;
          const url = 'https://res.cloudinary.com/deueufyac/image/upload/';

          if (result.info.coordinates) {
            const x = result.info.coordinates.custom[0][0];
            const y = result.info.coordinates.custom[0][1];
            const w = result.info.coordinates.custom[0][2];
            const h = result.info.coordinates.custom[0][3];
            //const crop = 'c_crop,g_face,h_'+h+',w_'+w+',x_'+x+',y_'+y+'/';
            const crop = 'h_' + h + ',w_' + w + ',x_' + x + ',y_' + y + ',c_crop/';
            this.objectUpdate = url + crop + path;
            this.onUpdateUser(false);
          }
          
        }
      }
    );
  }

  getUser() {
    this.usersService.getUser().then((userData) => {
      if (userData) {
        this.userData = userData;
        this.url_image = this.userData.url_image;
        //this.rolName = this.userData.user_roles_fair[0].name;
        if (this.userData.speaker) {
          this.rolName = this.userData.speaker.position;
          this.url_image = this.userData.speaker.profile_picture;
        }
        else {
          this.rolName = 'Asistente';
        }
        this.initializeToopTipMenu();
      }
    });
  }

  changeToolTipPhoto() {
    let topMenu = 0;
    let img: any = document.getElementById('image-form');
    img = this.imageBack.nativeElement;
    this.imageForm.logout = { top: img.offsetTop + topMenu, left: img.offsetLeft, with: img.width, height: img.height };
  }

  @HostListener('window:resize')
  initializeToopTipMenu() {
    setTimeout(() => {
      this.changeToolTipPhoto();
    }, 100);
    setTimeout(() => {
      this.changeToolTipPhoto();
    }, 1000);
    setTimeout(() => {
      this.changeToolTipPhoto();
    }, 3000);
  }

  onCropperImage() { }

  ionViewWillEnter() { this.initializeToopTipMenu(); }
  ionViewDidEnter() { this.initializeToopTipMenu(); }
  ionViewWillLeave() { this.initializeToopTipMenu(); }
  ionViewDidLeave() { this.initializeToopTipMenu(); }


  listenForFullScreenEvents() {


    window.addEventListener('window:resize-menu', (event: any) => {
      this.initializeToopTipMenu();
    });
  }


  onSelectFile(event) {
    this.myWidgetFalse.open();
  }

  onUpdateUser(reload) {

    this.loading.present({ message: 'Cargando...' });
    const dt = {};
    this.errors = null;
    dt[this.keyUpdate] = this.objectUpdate;


    this.usersService.getUser().then((userDataSession: any) => {
      this.usersService.updateUser(userDataSession, dt)
        .subscribe(
          data => {

            if (data.success == 201) {
              this.userData.url_image = data.data.url_image;
              this.userData.name = data.data.name;
              this.userData.last_name = data.data.last_name;
              this.url_image = data.data.url_image;
              this.usersService.setUser(this.userData).then((data) => {
                this.presentToast('Registro guardado exitosamente');
                if (reload) {
                  window.location.reload();
                }
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

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async changeName() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar Nombre',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            this.keyUpdate = 'name';
            this.objectUpdate = data[this.keyUpdate];
            this.onUpdateUser(true);
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
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data: any) => {
            this.keyUpdate = 'last_name';
            this.objectUpdate = data[this.keyUpdate];
            this.onUpdateUser(true);
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

}
