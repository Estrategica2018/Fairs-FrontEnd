import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from './../../api/users.service';
import { FairsService } from './../../api/fairs.service';
import { LoadingService } from './../../providers/loading.service';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';
import { AlertController, ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { AdminFairsService } from './../../api/admin/fairs.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterPage implements OnInit {
  @Input() _parent: any;
  @Input() showMenu: string;
  @Input() admin: string;
  @Input() email_recovery: string;
  email: string;
  submitted = false;
  errors = null;
  success = null;
  dark = false;
  modal = null;
  fair = null;
  showConfirmAccount = null;
  loginForm: FormGroup;
  register: FormGroup;
  recoveryForm: FormGroup;
  singupConfirmForm: FormGroup;
  userDataSession: any;
  profileRole: any;
  singupConfirmMsg: any;
  emailActivateError: any;
  emailSingConfirm: any;

  @ViewChildren('digitSix') digitSix: any;

  /*{
    name:'',
    last_name:'',
    documento_tipo:'',
    documento_numero: '',
    email:'',
    correo_electronico_adicional: '',
    numero_celular: '',
    pais_inscripcion: '',
    zona_se_encuentra_en: '',
    zona_se_encuentra_en_otra: '',
    sexo_se_reconoce_como: '',
    sexo_se_reconoce_como_otro: '',
    sexo_registro_civil: '',
    sexo_registro_civil_otro: '',
    cultura_se_reconoce_como: '',
    cultura_se_reconoce_como_otro: '',
    discapacidad: 'No',
    discapacidad_cual: '',
    relacion_sector_rol: '',
    relacion_sector_rol_otro: '',
    institucion_vinculo: '',
    codigo_cbu: '',
    institucion_ubicacion: '',
    escolaridad_nivel: '',
  }*/

  constructor(
    private router: Router,
    private loading: LoadingService,
    private usersService: UsersService,
    private fairsService: FairsService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer,
    private alertCtrl: AlertController,
    private adminFairsService: AdminFairsService
  ) {

    this.fairsService.getCurrentFair().
    then( fair => {
      this.fair = fair;
    },error => {
      this.loading.dismiss();
      this.errors = error;
    });
  }
  ngOnInit() {
    this.singupConfirmForm = this.formBuilder.group({
      item1: ['', [Validators.required, Validators.maxLength(1)]],
      item2: ['', [Validators.required, Validators.maxLength(1)]],
      item3: ['', [Validators.required, Validators.maxLength(1)]],
      item4: ['', [Validators.required, Validators.maxLength(1)]],
      item5: ['', [Validators.required, Validators.maxLength(1)]],
      item6: ['', [Validators.required, Validators.maxLength(1)]]
    });
    //this.loading.present({message:'Cargando...'});
    this.register = this.formBuilder.group({
      /*
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],     */
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name:['',Validators.required],
      last_name:['',Validators.required],
      documento_tipo:['',Validators.required],
      documento_numero:['',Validators.required],
      email:['',Validators.required],
      correo_electronico_adicional:[''],
      numero_celular:['',Validators.required],
      pais_inscripcion:['',Validators.required],
      zona_se_encuentra_en:['',Validators.required],
      zona_se_encuentra_en_otra:[''],
      sexo_se_reconoce_como:['',Validators.required],
      sexo_se_reconoce_como_otro:[''],
      sexo_registro_civil:['',Validators.required],
      //sexo_registro_civil_otro:['',Validators.required],
      cultura_se_reconoce_como:['',Validators.required],
      //cultura_se_reconoce_como_otro:['',Validators.required],
      discapacidad:[''],
      discapacidad_cual:['',Validators.required],
      relacion_sector_rol:['',Validators.required],
      //relacion_sector_rol_otro:['',Validators.required],
      institucion_vinculo:['',Validators.required],
      codigo_cbu:[''],
      institucion_ubicacion:['',Validators.required],
      escolaridad_nivel:['',Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  onRegisterSubmit() {
    this.submitted = true;
    this.errors = null;
    this.success = null;
    this.emailActivateError = null;

    // stop here if form is invalid

      if (this.register.invalid) {
        return;
      }

    this.loading.present({message:'Cargando...'});

    this.usersService.findEmail(this.register.value['email'])
      .then( response => {

          if(response.status === 201) {console.log('si ingresa envio correo no encuentra usuaior')

            this.emailActivateError = true;
            this.loading.dismiss();
          }
          else {
            console.log('ingresa envio correo no encuentra usuaior')
            this.emailActivateError = false;
            this.loading.dismiss();
            this.emailSingConfirm = this.register.value['email'];
            this.onSendSignConfirm(this.emailSingConfirm, this.fair.name);
          }
        },
        error => {
          this.loading.dismiss();
          this.errors = error;
        });
  }
  get f() { return this.register.controls; }
  get sc() { return this.singupConfirmForm.controls; }

  onSendSignConfirm(email, fairName) {
    console.log('ingresa envio correo',email)
    this.loading.present({message:'Cargando...'});

    this.usersService.sendSignConfirm(email, fairName)
      .then(data => {

          this.singupConfirmMsg = "";

          if(data.success === 201) {
            console.log('envio correo')
            console.log('ingresa envio correo',email,data)
            this.loading.dismiss();
            this.showMenu = 'singupConfirm';
            this.submitted = null;
            this.errors = null;
            this.showConfirmAccount = true;
            this.singupConfirmMsg = `Hemos enviado un correo electrónico a ${email} con el código de verificación`;
          }
          else {
            console.log('error envio correo')
            this.loading.dismiss();
            this.errors = 'Consultando el servicio para validación del usuario';
          }
        },
        error => {
          this.loading.dismiss();
          this.errors = error;
        });
  }

  onSingupValidate() {

    this.loading.present({message:'Cargando...'});

    let code = this.singupConfirmForm.value['item1'] + this.singupConfirmForm.value['item2'] + this.singupConfirmForm.value['item3'] + this.singupConfirmForm.value['item4'] + this.singupConfirmForm.value['item5'] + this.singupConfirmForm.value['item6'];
    this.emailSingConfirm = this.emailSingConfirm || this.email_recovery;
    this.usersService.singupValidate(this.emailSingConfirm, code)
      .then(data => {
          if(data.error ) {
            this.loading.dismiss();
            this.errors = data.message;
          }
          else if(data.success === 201) {
            //this.loading.dismiss();
            this.errors = null;
            this.success = 'Código validado exitósamente';

            this.onSingup();
          }
          else {
            this.loading.dismiss();
            this.errors = 'Consultando el servicio para validación del usuario';
          }
        },
        error => {

          this.loading.dismiss();
          this.errors = error;
        });
  }

  onSingup() {
    const signupData = {
      'user_name': this.register.value['name'].replace(' ','') + '_' + Date.now(),
      'name': this.register.value['name'],
      'last_name': this.register.value['last_name'],
      'password': this.register.value['password'],
      'email': this.register.value['email'],
      'confirmPassword': this.register.value['confirmPassword'],
      'role_id': 4,
      'fair_id': this.fair.id
    }
    this.usersService.signup(signupData)
      .then(data => {
          if(data.success === 201) {
            this.loading.dismiss();
            this.onLogin(Object.assign({password:this.register.value['password']}, data.data), this.fair.id);
          }
          else {
            this.loading.dismiss();
            if(data.email) {
              this.errors = 'Correo electrónico ya registrado';
            }
            else {
              this.errors = 'Consultando el servicio para creación del usuario';
            }
          }
        },
        error => {
          this.loading.dismiss();
          this.errors = error;
        });
  }

  onLogin(userData, fair_id) {
    this.loading.present({message:'Cargando...'});
    this.usersService.login(userData.email,userData.password, fair_id)
      .subscribe(
        data => {
          const token = data.data;
          this.usersService.setUser(Object.assign(userData,{token:token})).then(() => {
            //this.router.navigateByUrl('/schedule');
            //window.dispatchEvent(new CustomEvent('user:signup'));
            //window.location.href('/');
            this.loading.dismiss();
            window.location.href='/';
          });
        },
        error => {
          this.loading.dismiss();
          this.errors = error;
        });
  }

  paste(event){

    let clipboardData = event.clipboardData || (<any>window).clipboardData; //typecasting to any
    let pastedText = clipboardData.getData('text');

    if(pastedText.length == 6 ) {
      this.singupConfirmForm = this.formBuilder.group({
        item1: [pastedText[0], [Validators.required, Validators.maxLength(1)]],
        item2: [pastedText[1], [Validators.required, Validators.maxLength(1)]],
        item3: [pastedText[2], [Validators.required, Validators.maxLength(1)]],
        item4: [pastedText[3], [Validators.required, Validators.maxLength(1)]],
        item5: [pastedText[4], [Validators.required, Validators.maxLength(1)]],
        item6: [pastedText[5], [Validators.required, Validators.maxLength(1)]]
      });
    }

  }

  onDigitInput(event){

    let element = null;

    if (event.code !== 'Backspace') {

      if(this.digitSix.last.nativeElement !== event.srcElement ) {

        for(let i=0; i < this.digitSix._results.length; i++) {
          if(event.srcElement == this.digitSix._results[i].nativeElement) {
            element = this.digitSix._results[i+1].nativeElement;
            break;
          }
        }
      }
    }
    if (event.code === 'Backspace') {
      element = event.srcElement.previousElementSibling;
    }
    if(element == null) {
      return;
    }
    else {
      element.focus();
    }
  }
}
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}
