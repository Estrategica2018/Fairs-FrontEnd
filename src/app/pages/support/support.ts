import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AlertController, ToastController } from '@ionic/angular';
import { LoadingService } from './../../providers/loading.service';
import { FairsService } from '../../api/fairs.service';

@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  styleUrls: ['./support.scss'],
})
export class SupportPage implements OnInit {
  submitted = false;
  success = false;
  
  dark = false;
  errors = null;
  
  messageForm: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
	private formBuilder: FormBuilder,
	private loading: LoadingService,
	private fairsService: FairsService,
  ) { 
      this.listenForDarkModeEvents();
  }

 ngOnInit() {
	 this.messageForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            supportMessage: ['', [Validators.required, Validators.minLength(6)]]
        });
  }
  
  get f() { return this.messageForm.controls; }
  
  onSubmit() {
	  
	this.submitted = true;

	// stop here if form is invalid
	if (this.messageForm.invalid) {
		return;
	}

	this.loading.present({message:'Cargando...'});
      
      this.fairsService.getCurrentFair().
      then( fair => {
          const data = {
            'name': this.messageForm.value['name'],
            'email': this.messageForm.value['email'],
            'supportMessage': this.messageForm.value['supportMessage'],
            'fair_id': fair.id
          }
          this.fairsService.sendMessage(data)
          .then(
            success => {
                if(success.success === 201) {
                      this.presentToast(`Tu mensaje para el grupo de soporte ha sido enviado`);
					  this.submitted = false;
					  this.loading.dismiss();
                    
                }
                else {
                    this.loading.dismiss();
                    this.errors = 'Consumiendo el servicio para envío de mensaje';
                }
            },
            error => {
                this.loading.dismiss();
                this.errors = error;
          });
      });
  }


  listenForDarkModeEvents() {
      window.addEventListener('dark:change', (e:any) => {
      setTimeout(() => {
        console.log(e);
       this.dark = e.detail;
      }, 300);
    });
  }
  
  openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }
  
  async presentToast(message) {
    let toast =  await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    await toast.present();
  }
   

  // If the user enters text in the support question and then navigates
  // without submitting first, ask if they meant to leave the page
  // async ionViewCanLeave(): Promise<boolean> {
  //   // If the support message is empty we should just navigate
  //   if (!this.messageForm.value.supportMessage || this.messageForm.value.supportMessage.trim().length === 0) {
  //     return true;
  //   }
  //
  //   return new Promise((resolve: any, reject: any) => {
  //     const alert = await this.alertCtrl.create({
  //       title: 'Leave this page?',
  //       message: 'Are you sure you want to leave this page? Your support message will not be submitted.',
  //       buttons: [
  //         { text: 'Stay', handler: reject },
  //         { text: 'Leave', role: 'cancel', handler: resolve }
  //       ]
  //     });
  //
  //     await alert.present();
  //   });
  // }
}
