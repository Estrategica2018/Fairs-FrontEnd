import { Component, OnInit } from '@angular/core';
import { AgendasService } from './../../../api/agendas.service';
import { FairsService } from './../../../api/fairs.service';
import { SpeakersService } from './../../../api/speakers.service';
import { CategoryService } from './../../../api/category.service';
import { AdminAgendasService } from './../../../api/admin/agendas.service';
import { LoadingService } from './../../../providers/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { AlertController, ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { SpeakersSelectPage } from '../speakers-select/speakers-select.page';
import { AudienceSelectPage } from '../audience-select/audience-select.page';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  agenda: any;
  errors: any = null;
  success: string = null;
  fair: any;
  action: string;
  categories = [];
  speakers: any = [];
  emails: any = [];
  editSave = null;
  invited_emails: any = [];
  invited_speakers: any = [];
  agendaForm: FormGroup;
  submitted = false;
  initSubmitted = false;
  showHourDatetime = false;
  hour = '';
  syncZoom = 1;

  constructor(
    private agendasService: AgendasService,
    private routeActivated: ActivatedRoute,
    private router: Router,
    private loading: LoadingService,
    private adminAgendasService: AdminAgendasService,
    private fairsService: FairsService,
    private speakersService: SpeakersService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
  ) {

  }

  ngDoCheck() {
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  get f() { return this.agendaForm.controls; }

  ngOnInit() {

    this.loading.present({ message: 'Cargando...' });

    this.invited_speakers = [];
    this.fairsService.getCurrentFair().then((fair) => {
      this.fair = fair;

      const agendaId = this.routeActivated.snapshot.paramMap.get('agendaId');
      if (agendaId != null) {
        this.adminAgendasService.getEmails(this.fair.id, agendaId).then((response) => {
          this.emails = response.data.audience;
          this.invited_emails = this.emails.filter((audience) => {
            return audience.check == 1;
          });
        })
          .catch(error => {
            this.errors = error;
          });
      }
      this.categoryService.list('AgendaType', this.fair).then((response) => {
        if (response.success == 201) {
          this.categories = response.data;

          if (agendaId) {
            this.action = 'update';

            this.agendasService.get(agendaId, true)
              .then((agenda) => {
                this.loading.dismiss();

                this.invited_speakers = [];
                this.errors = null;
                this.agenda = Object.assign({}, agenda);
                this.agenda.invited_speakers.forEach((speaker) => {
                  this.invited_speakers.push(Object.assign({}, speaker));
                });
                this.agenda.invited_speakers = null;
                this.agenda.duration_time = this.agenda.duration_time.toString();
                if (this.agenda.category) this.agenda.category.id = this.agenda.category.id.toString();

                this.buidAgendaForm(this.action);

              })
              .catch(error => {
                this.loading.dismiss();
                this.errors = error;
              });
          }
          else {
            this.action = 'create';
            this.buidAgendaForm(this.action);

            this.agenda = {
              //'category':this.categories[0]
            };
            this.loading.dismiss();
          }
        }
        else {
          this.errors = `Consultando las categorias de agenda`;
        }
      });

    });

    this.speakersService.
      list().then((speakers) => {
        this.speakers = speakers;
      })
      .catch(error => {
        this.errors = error;
      });

  }

  durations: any[] = [
    { id: 15, name: '15 min' },
    { id: 30, name: '30 min' },
    { id: 45, name: '45 min' },
    { id: 60, name: '1 hora' },
    { id: 90, name: '1 hora y 30 min' },
    { id: 120, name: '2 horas' },
    { id: 150, name: '2 horas y 30 min' },
    { id: 180, name: '3 horas' },
    { id: 210, name: '3 horas y 30 min' },
    { id: 240, name: '4 horas' }
  ];

  timezones: any[] = [
    { name: 'America/Bogota' },
    { name: 'America/Mexico_City' },
    { name: 'America/New_York' },
    { name: 'America/Sao_Paulo' },
    { name: 'America/Argentina/Buenos_Aires' }
  ];

  audiences: any[] = [
    { id: 1, name: 'Público general' },
    { id: 2, name: 'Lista de correo' },
    { id: 3, name: 'Pago dentro de la feria' },
    { id: 4, name: 'Pago por evento' },
    { id: 5, name: 'Tope de participantes' }
  ];

  onCreateAgenda() {
    this.errors = null;
    this.success = null;
    this.loading.present({ message: 'Cargando...' });

    const startTimeStr = this.agendaForm.value['date'] + 'T' + this.agendaForm.value['hour'] + ':00';
    const startTime = moment(startTimeStr, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');

    let data = {
      'topic': this.agendaForm.value['title'],
      'agenda': this.agendaForm.value['description'],
      'start_time': startTime,
      'duration_time': this.agendaForm.value['duration_time'],
      'timezone': this.agendaForm.value['timezone'],
      'category_id': this.agendaForm.value['category'],
      'fair_id': this.fair.id,
      'resources': {},
      'audience_config': this.agendaForm.value['audience_config'],
      'price': this.agenda.price,
      'zoom_password': this.agendaForm.value['zoom_password'],
      'zoom_code': this.agendaForm.value['zoom_code'],
      'description_large': this.agendaForm.value['description_large']
    };

    if(this.agenda.audience_config == 5) {
      data.resources =  {"guests": this.agendaForm.value.guests};
    }

    this.adminAgendasService.create(data)
      .then((agenda) => {
        this.loading.dismiss();
        this.agenda = agenda;
        this.fairsService.refreshCurrentFair();
        this.agendasService.refreshCurrentAgenda();
        this.success = `Agenda creada exitosamente`;
        this.presentToast(this.success);
        this.redirectTo(`/super-admin/agenda/${this.agenda.id}`);
        this.initSubmitted = false;
      },
        (error) => {
          this.loading.dismiss();
          console.log(error);
          this.errors = `Ha ocurrido un error al crear la agenda`;
          this.presentToast(this.errors);
          this.initSubmitted = false;
        })
      .catch(error => {
        this.loading.dismiss();
        console.log(error);
        this.errors = `Ha ocurrido un error al crear la agenda`;
        this.initSubmitted = false;
      });
  }

  onUpdateAgenda() {
    this.loading.present({ message: 'Cargando...' });
    const startTimeStr = this.agendaForm.value['date'].substr(0, 10) + 'T' + this.agendaForm.value['hour'] + ':00';
    const startTime = moment(startTimeStr, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm');
    let data = {
      'id': this.agenda.id,
      'topic': this.agendaForm.value['title'],
      'agenda': this.agendaForm.value['description'],
      'start_time': startTime,
      'duration_time': this.agendaForm.value['duration_time'],
      'timezone': this.agendaForm.value['timezone'],
      'category_id': this.agendaForm.value['category'],
      'fair_id': this.fair.id,
      'resources': {},
      'audience_config': this.agendaForm.value['audience_config'],
      'zoom_code': this.agendaForm.value['zoom_code'],
      'price': this.agenda.price,
      'zoom_password': this.agendaForm.value['zoom_password'],
      'description_large': this.agendaForm.value['description_large'],
      'syncZoom': this.syncZoom ? 1 : 0
    };

    if(this.agenda.audience_config == 5) {
      data.resources =  {"guests": this.agendaForm.value.guests};
    }

    this.errors = null;
    this.success = null;

    this.adminAgendasService.update(data)
      .then((response) => {
        this.agendasService.refreshCurrentAgenda();
        this.agendasService.get(this.agenda.id, true)
          .then((agenda) => {
            this.agenda = agenda;
            this.initSubmitted = false;

            this.agenda.duration_time = this.agenda.duration_time.toString();
            if (this.agenda.category) this.agenda.category.id = this.agenda.category.id.toString();
            this.agenda.start_time = moment(this.agenda.start_at).format('YYYY-MM-DDTHH:mm:ss');


            this.success = `Agenda modificada exitosamente`;
            this.loading.dismiss();
            this.presentToast(this.success);
          })
          .catch(error => {
            this.loading.dismiss();
            console.log(error);
            this.initSubmitted = false;
            this.errors = `Ha ocurrido un error al modificar la agenda`;
            this.presentToast(this.errors);
          });
      },
        (error) => {
          console.log(error);
          this.initSubmitted = false;
          this.errors = `Ha ocurrido un error al modificar la agenda`;
          this.presentToast(this.errors);
          this.loading.dismiss();
        })
      .catch(error => {
        this.errors = error;
        this.loading.dismiss();
      });
  }

  async onDeleteAgenda() {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borra agenda?',
      subHeader: 'Confirma para borrar la agenda',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {
            this.adminAgendasService.delete(this.agenda)
              .then((response) => {
                this.success = `Agenda borrada exitosamente`;
                this.fairsService.refreshCurrentFair();
                this.agendasService.refreshCurrentAgenda();
                this.redirectTo(`/super-admin/agenda-list`);
              },
                (error) => {
                  console.log(error);
                  this.errors = `Ha ocurrido un error al eliminar la agenda`;
                })
              .catch(error => {
                console.log(error);
                this.errors = `Ha ocurrido un error al eliminar la agenda`;
              });

          }
        }
      ]
    });
    await alert.present();

  }

  onChangeStartTime() {
    let hour = this.agendaForm.value.hour;
    if(hour.indexOf("T")> 0)  {
      hour = (this.agendaForm.value.hour.split('T')[1]).substr(0, 4) + ':00';
    }
    this.agenda.start_time = this.agendaForm.value.date.split('T')[0] + 'T' + hour;
  }

  async onChangeImage() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: '',
      message: `<img src="${this.agenda.resources.url_image}" class="card-alert">`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.agenda.resources.url_image = data.url;
          }
        }
      ],
      inputs: [
        {
          name: 'url',
          type: 'text',
          placeholder: 'Url',
          value: this.agenda.resources.url_image
        }
      ]
    });
    await alert.present();
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  async presentSpeakers() {
    const modal = await this.modalCtrl.create({
      component: SpeakersSelectPage,
      swipeToClose: true,
      backdropDismiss:false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'invited_speakers': this.invited_speakers,
        'speakers': this.speakers,
        'fair_id': this.fair.id,
        'meeting_id': this.agenda.id,
      },
      cssClass: 'speakers-modal'
    });
    await modal.present();
    this.success = null;
    this.errors = null;
    const { data } = await modal.onWillDismiss();

    if (data) {
      this.loading.present({ message: 'Cargando...' });
      this.adminAgendasService.updateSpeakers(this.fair.id, this.agenda.id, { 'invited_speakers': data })
        .then((response) => {
          if (response.success == 201) {

            this.agendasService.refreshCurrentAgenda();
            this.agendasService.get(this.agenda.id, false)
              .then((agenda) => {
                this.invited_speakers = [];
                agenda.invited_speakers.forEach((speaker) => {
                  this.invited_speakers.push(Object.assign({}, speaker));
                });
                this.success = `Invitados asociados exitosamente`;
                this.presentToast(this.success);
                this.loading.dismiss();
              })
              .catch(error => {
                this.loading.dismiss();
                console.log(error);
                this.errors = `Error modificando los conferencistas en la feria`;
                this.presentToast(this.errors);
              });
          }
          else {
            console.log(this.errors);
            this.loading.dismiss();
            this.errors = `Error modificando los conferencistas en la feria`;
            this.presentToast(this.errors);
          }
        })
        .catch(error => {
          console.log(error);
          this.loading.dismiss();
          this.errors = `Error modificando los conferencistas en la feria`;
          this.presentToast(this.errors);
        });

    }
  }

  async presentAudience() {
    const modal = await this.modalCtrl.create({
      component: AudienceSelectPage,
      swipeToClose: true,
      //backdropDismiss:false,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'invited_speakers': this.invited_emails,
        'audiences': this.emails,
        'fair_id': this.fair.id,
        'meeting_id': this.agenda.id
      }
    });
    await modal.present();
    this.success = null;
    this.errors = null;
    const { data } = await modal.onWillDismiss();

    if (data) {

      data.forEach((audience) => {
        audience.check = audience.checked ? 1 : 0;
      });
      this.invited_emails = data.filter((audience) => {
        return audience.check == 1;
      });

      this.adminAgendasService.updateAudience(this.fair.id, this.agenda.id, { 'audience': data })
        .then((invited_emails) => {
          this.success = `Lista de correos modificada exitósamente`;
          this.presentToast(this.success);
        })
        .catch(error => {
          this.errors = error;
          this.errors = `Error modificando la lista de correos`;
          this.presentToast(this.errors);
        });

    }
  }

  async presentActionPrice() {

    let buttons = [];
    buttons.push({
      text: this.agenda.price,
      role: 'destructive',
      handler: (value) => {
        this.editSave = true;
      }
    });

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.alertCtrl.create({
      header: 'Precio del producto',
      message: "Ingresa el precio del producto",
      inputs: [
        {
          name: 'price',
          value: this.agenda.price,
          placeholder: '$ Precio'
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
            this.agenda.price = data.price;
          }
        }
      ]
    });
    await actionSheet.present();

  }

  onSave() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.agendaForm.invalid) {
      return;
    }

    if (!this.initSubmitted) {
      this.initSubmitted = true;
      if (this.agenda.id) {
        this.onUpdateAgenda();
      }
      else {
        this.onCreateAgenda();
      }
    }
  }

  changeCategory() {

    this.categories.forEach((category) => {
      if (category.id == this.agendaForm.value['category']) {
        this.agenda.category = category;
      }
    });
  }

  changeAudienceConfig(agenda) {
    agenda.audience_config = this.agendaForm.value['audience_config'];
    this.buidAgendaForm(this.action);
  }

  buidAgendaForm(action) {

    if (action == 'update') {
      const start_time = moment(this.agenda.start_at);
      this.hour = start_time.format('hh:mm a');

      if(this.agenda.audience_config == 5) {
        this.agendaForm = this.formBuilder.group({
          title: [this.agenda.title, [Validators.required]],
          description: [this.agenda.description, [Validators.required]],
          date: [start_time.format('YYYY-MM-DD'), [Validators.required]],
          hour: [start_time.format('HH:mm'), [Validators.required]],
          duration_time: [this.agenda.duration_time, [Validators.required]],
          timezone: [this.agenda.timezone, [Validators.required]],
          category: [this.agenda.category.id, [Validators.required]],
          audience_config: [this.agenda.audience_config, [Validators.required]],
          zoom_code: [this.agenda.zoom_code, []],
          zoom_password: [this.agenda.zoom_password, []],
          guests: [this.agenda.resources.guests, [Validators.required]],
          description_large: [this.agenda.description_large, []]
        });
      }
      else {
        this.agendaForm = this.formBuilder.group({
          title: [this.agenda.title, [Validators.required]],
          description: [this.agenda.description, [Validators.required]],
          date: [start_time.format('YYYY-MM-DD'), [Validators.required]],
          hour: [start_time.format('HH:mm'), [Validators.required]],
          duration_time: [this.agenda.duration_time, [Validators.required]],
          timezone: [this.agenda.timezone, [Validators.required]],
          category: [this.agenda.category.id, [Validators.required]],
          audience_config: [this.agenda.audience_config, [Validators.required]],
          zoom_code: [this.agenda.zoom_code, []],
          zoom_password: [this.agenda.zoom_password, []],
          description_large: [this.agenda.description_large, []]
        });
      }
      

      console.log(this.agenda);
    }
    else if (action == 'create') {
      const date = moment().format('YYYY-MM-DD');
      const hour = moment().format('HH:mm');

      this.agendaForm = this.formBuilder.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        date: [date, [Validators.required]],
        hour: [hour, [Validators.required]],
        duration_time: ['', [Validators.required]],
        timezone: ['', [Validators.required]],
        category: [this.categories[0].id, [Validators.required]],
        audience_config: ['1', [Validators.required]],
        zoom_code: ['', []],
        zoom_password: ['', []],
        description_large: ['', []]
      });
    }
  }

  deleteTag(audience) {
    if (this.invited_emails && this.invited_emails.length > 0) {
      this.invited_emails = this.invited_emails.filter((audTmp) => {
        return audience.email !== audTmp.email;
      })
    }
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

