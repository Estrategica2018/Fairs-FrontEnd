import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/api/users.service';
import { LoadingService } from 'src/app/providers/loading.service';

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

  constructor(private alertCtrl: AlertController,
    private router: Router,
    private toastCtrl: ToastController,
    private loading: LoadingService,
    private usersService: UsersService,
    private modalCtrl: ModalController) { }

  ngDoCheck() {
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  ngOnInit() {

    this.getUser();
  }

  getUser() {
    this.usersService.getUser().then((userData) => {
      if (userData) {
        this.userData = userData;
        this.url_image = this.userData.url_image;
        this.rolName = this.userData.user_roles_fair[0].name;
        if (this.userData.speaker) {
          this.rolName = this.userData.speaker.position;
          this.url_image = this.userData.speaker.profile_picture;

        }
        this.initializeToopTipMenu();
      }
    });
  }

  changeToolTipPhoto(){
    let topMenu = 0;
    let img: any = document.getElementById('image-form');
    if (img)
        this.imageForm.logout = { top: img.offsetTop + topMenu, left: img.offsetLeft };
        console.log(this.imageForm.logout);
        console.log(img.clientWidth, img.naturalWidth);
  }

  @HostListener('window:resize')
  initializeToopTipMenu() {
    setTimeout(() => {
      this.changeToolTipPhoto();   
    }, 100);
    setTimeout(() => {
      this.changeToolTipPhoto();   
    }, 1000);
  }

  onCropperImage(){}
}
