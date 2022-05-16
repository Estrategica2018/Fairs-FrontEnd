import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ToastController, ModalController } from '@ionic/angular';
import { LoadingService } from './../../providers/loading.service';
import { FairsService } from './../../api/fairs.service';

@Component({
  selector: 'app-app-dialog',
  templateUrl: './app-dialog.page.html',
  styleUrls: ['./app-dialog.page.scss'],
})
export class AppDialogPage implements OnInit {

  modal: any;
  
  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private loading: LoadingService,
    private fairsService: FairsService,
  ) { }

  ngOnInit() {
      
    this.fairsService.getCurrentFair().then((fair)=>{
        
        const dialogType = this.route.snapshot.paramMap.get('dialogType');
        
        if(dialogType == 'confirmAccount') {
            const email = this.route.snapshot.paramMap.get('email');
            this.presenterConfirmAccount(email);
        }
    });
  }

  async presenterConfirmAccount(email) {
    
    if(this.modal) { this.modal.dismiss(); }
    
    this.modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this,
        'showMenu': 'singupConfirm',
        'email_recovery': email
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

}
