import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AgendasService } from 'src/app/api/agendas.service';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FairsService } from 'src/app/api/fairs.service';
import { MinculturaService } from 'src/app/api/mincultura.service';
import { UsersService } from 'src/app/api/users.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-mincultura-catalog',
  templateUrl: './form-mincultura-catalog.page.html',
  styleUrls: ['./form-mincultura-catalog.page.scss'],
})
export class FormMinculturaCatalogPage implements OnInit {

  scheduleList: any;
  clientHeight: any;
  largeScreen: any;
  agendaSelect: any;
  mediumScreen: any;
  smallScreen: any;
  submitted: any;
  registerForm: FormGroup;
  fair: any;
  userDataSession: any;
  errors: any;
  success: any;
  urlBack = '';
  CategorySelector = 'all';
  disableSelection = false;
  agendaHover = null;
  minculturaUser = null;


  constructor(
    private agendasService: AgendasService,
    private alertCtrl: AlertController,
    private datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private fairsService: FairsService,
    private minculturaService: MinculturaService,
    private usersService: UsersService,
    private loading: LoadingService,
    private toastCtrl: ToastController,
    private router: Router,) {

    this.initializeFormsCatalogs();
  }

  ngOnInit() {
    setTimeout(() => { this.onResize(null); }, 100);
  }

  get f() { return this.registerForm.controls; }

  initializeFormsCatalogs() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      docType: ['', [Validators.required]],
      docNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      emailAdditional: ['', [Validators.email]]
    });

    this.loading.present({ message: 'Cargando...' });

    this.usersService.getUser().then((userDataSession: any) => {
      this.userDataSession = userDataSession;

      if (!this.userDataSession) {
        this.redirectTo('/user-register');
        this.loading.dismiss();
        return;
      }

      this.fairsService.getCurrentFair().
        then(fair => {

          this.fair = fair;

          this.minculturaService.getMinculturaUser(userDataSession, fair)
            .subscribe(
              response => {

                this.loading.dismiss();
                if (response.data) {
                  this.minculturaUser = response.data;
                  this.registerForm = this.formBuilder.group({
                    name: [this.userDataSession.name, Validators.required],
                    last_name: [this.userDataSession.last_name, Validators.required],
                    docType: [this.minculturaUser.documento_tipo, [Validators.required]],
                    docNumber: [this.minculturaUser.documento_numero, [Validators.required]],
                    email: [this.userDataSession.email, [Validators.required, Validators.email]],
                    emailAdditional: [this.minculturaUser.correo_electronico_adicional, [Validators.email]]
                  });
                }
                else {
                  this.registerForm = this.formBuilder.group({
                    name: [this.userDataSession.name, Validators.required],
                    last_name: [this.userDataSession.last_name, Validators.required],
                    docType: ['', [Validators.required]],
                    docNumber: ['', [Validators.required]],
                    email: [this.userDataSession.email, [Validators.required, Validators.email]],
                    emailAdditional: ['', [Validators.email]]
                  });
                }

                if (response.audience) {
                  let audiences = response.audience;
                  for (let audience of audiences) {
                    if (audience.agenda.category.name == 'Taller_M' || audience.agenda.category.name == 'Taller_T') {

                      this.agendaSelect = audience.agenda;
                      setTimeout(() => {
                        let check: any = document.querySelector<HTMLElement>('#check-agenda-' + this.agendaSelect.id);
                        if (check) check.checked = true;
                      }, 1000);
                      this.disableSelection = true;
                    }

                  }
                }
                if (response.meetings) {
                  for (let agenda of response.meetings) {
                    agenda.start_at *= 1000;
                  }
                  this.initializeAgendaFormsCatalogs(response.meetings);
                }

              },
              error => {
                this.loading.dismiss();
                this.errors = error;
              });
        });
    });
  }

  initializeAgendaFormsCatalogs(agendas) {

    this.scheduleList = [];

    if (agendas.length > 0) {
      agendas.forEach((agenda) => {
        if (this.CategorySelector == 'all' || agenda.category.name == this.CategorySelector) {
          this.scheduleList.push(agenda);
          let name;
          agenda._nameSpeakers = '';
          for (let speaker of agenda.invited_speakers) {
            name = speaker.speaker.user.name + ' ' + speaker.speaker.user.last_name;
            if (agenda._nameSpeakers != null && agenda._nameSpeakers.length > 0) {
              agenda._nameSpeakers += ',';
            }
            agenda._nameSpeakers += name;
          }

          agenda.startTime = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
          agenda.endTime = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
        }

        setTimeout(() => {
          this.onResize(null);
        }, 100);

      });

    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.largeScreen = window.innerWidth >= 1308;
    this.mediumScreen = window.innerWidth >= 859 && window.innerWidth <= 1308;
    this.smallScreen = window.innerWidth <= 859;
  }

  changeSelect(agenda) {
    console.log('changeSelect', agenda);

    let check: any = document.querySelector<HTMLElement>('#check-agenda-' + agenda.id);
    if (check && check.checked) {

      let lista = document.querySelectorAll('.check-agenda');
      lista.forEach((checkAgenda: any) => {
        if (checkAgenda) checkAgenda.checked = false;
      });

      if (this.disableSelection || agenda.full == "1") {
        let check: any = document.querySelector<HTMLElement>('#check-agenda-' + this.agendaSelect.id);
        if (check) check.checked = true;
      } else {
        this.agendaSelect = agenda;
        if (check) check.checked = true;
      }
    }
    else {
      if (this.disableSelection || agenda.full == "1") {
        let lista = document.querySelectorAll('.check-agenda');
        lista.forEach((checkAgenda: any) => {
          if (checkAgenda) checkAgenda.checked = false;
        });

        if (agenda.id == this.agendaSelect.id) {
          let check: any = document.querySelector<HTMLElement>('#check-agenda-' + this.agendaSelect.id);
          if (check) check.checked = true;
        }
      }
      
      else {
        this.agendaSelect = null;
      }
    }
  }

  onRegister() {
    this.submitted = true;
    let agendaId = null;
    this.success = null;
    this.errors = null;

    if (this.registerForm.invalid) {
      this.presentToast('Por favor complete los campos para finalizar la inscripción');
      return;
    }

    if (this.agendaSelect == null || !this.agendaSelect.id) {
      this.presentToast('Debe seleccionar un taller para la inscripción');
      return;
    }

    this.minculturaUser = {
      'name': this.registerForm.value.name,
      'last_name': this.registerForm.value.last_name,
      'docType': this.registerForm.value.docType,
      'docNumber': this.registerForm.value.docNumber,
      'emailAdditional': this.registerForm.value.emailAdditional
    }

    if (this.agendaSelect) {
      agendaId = this.agendaSelect.id;
    }
    else {
      this.closeModal();
    }

    this.loading.present({ message: 'Cargando...' });
    
    this.minculturaService.getMinculturaUser(this.userDataSession, this.fair)
            .subscribe(
              response => {

                this.loading.dismiss();
                if (response.data) {

                  if (response.meetings) {
                    for (let agenda of response.meetings) {
                      if(agenda.id == this.agendaSelect.id) {
                        if(agenda.full == 1) {
                          this.presentToast('Lo sentimos este evento se ha agotado');

                          for (let agenda of response.meetings) {
                            agenda.start_at *= 1000;
                          }
                          this.initializeAgendaFormsCatalogs(response.meetings);
                          this.agendaSelect = null;
                          return;
                        }
                      }
                    }
                    
                  }
                  
                  this.minculturaService.registerMinculturaUser(this.userDataSession, this.fair, this.minculturaUser, agendaId)
                  .subscribe(
                    response => {
                      this.loading.dismiss();
                      this.success = "Evento vitual registrado exitósamente";
                      this.disableSelection = true;
            
                      setTimeout(() => {
                        this.closeModal();
                      }, 1500);
                    },
                    error => {
                      this.loading.dismiss();
                      this.presentToast(error);
                      this.errors = error;
                    });

                }

              },
              error => {
                this.loading.dismiss();
                this.errors = error;
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

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }


  async closeModal() {
    const redirect = this.fair.redirectTo || 'map-site/fair/7';
    if (this.disableSelection) {      
      this.redirectTo(redirect);
    }
    else {
      const alert = await this.alertCtrl.create({
        subHeader: '¿Está seguro que desea salir sin registrarse en algún taller?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            handler: (data: any) => {
              
              this.redirectTo(redirect);
            }
          }
        ]
      });
      await alert.present();
    }
  }
}
