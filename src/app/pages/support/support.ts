import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AlertController, ToastController } from '@ionic/angular';
import { LoadingService } from './../../providers/loading.service';
import { FairsService } from '../../api/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { AgendasService } from './../../api/agendas.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  styleUrls: ['./support.scss'],
})
export class SupportPage implements OnInit {
  submitted = false;
  success = null;
  isHover1: boolean;
  isHover2: boolean;
  isHover3: boolean;
  isHover4: boolean;
  dark = false;
  errors = null;
  
  
  messageForm: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private fairsService: FairsService,
    private route: ActivatedRoute,
    private agendasService: AgendasService,
    private datepipe: DatePipe,
  ) { 
      this.listenForDarkModeEvents();
  }
 
 ngDoCheck(){
   document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
 }
 
 ngOnInit() {
    
    
    //const orgstructure = this.route.snapshot.paramMap.get('orgstructure');
    const orgstructure = this.route.snapshot.queryParams.orgstructure;
    
    if(orgstructure=='Agenda') {
        //const sessionId = this.route.snapshot.paramMap.get('sessionId');
        const sessionId = this.route.snapshot.queryParams.sessionId;
        this.loading.present({message:'Cargando...'});
        
        this.agendasService.get(sessionId)
         .then((agenda) => {
            this.loading.dismiss();
            this.errors = null;
            
            const strDay = this.datepipe.transform(new Date(agenda.start_at), 'EEEE, MMMM d, y');
            const startHour = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
            const endHour = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
            const location = agenda.room ? agenda.room.name : '';
            
            const session = Object.assign({
              "strDay": strDay,
              "timeStart": startHour,
              "timeEnd": endHour,
              "location": location
            },agenda);
            
            let message = '';
            message =  `Buen día,`;
            message +=  `\n Quisiera obtener información sobre el evento "${session.description}" `;
            message +=  ` realizado el día ${session.strDay} `;
            if(session.location) {
              message +=  ` en ${session.location}`;
            }
            
            this.messageForm.controls['supportMessage'].setValue(message);    
            
        })
        .catch(error => {
           this.loading.dismiss();
           this.errors = error;
        });
    }
    
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
            'message': this.messageForm.value['supportMessage'],
            'fair_id': fair.id
          }
          this.fairsService.sendMessage(data)
          .then( (response) => {
                if(response.success === 201) {
                   this.submitted = false;
                   this.loading.dismiss();
                   this.errors = null;
                   this.success = `${response.message}`;
                }
                else {
                    this.loading.dismiss();
                    this.errors = `Consultando el servicio para envío de mensajes: ${response}`;
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
