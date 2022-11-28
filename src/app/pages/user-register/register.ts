import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from './../../api/users.service';
import { FairsService } from './../../api/fairs.service';
import { LoadingService } from './../../providers/loading.service';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';
import { AlertController, ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { AdminFairsService } from './../../api/admin/fairs.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AgendasService } from 'src/app/api/agendas.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterPage implements OnInit {
  showMenu: string;
  liveStream: any;
  email: string;
  submitted = false;
  errors = null;
  success = null;
  dark = false;
  modal = null;
  fair = null;
  action: string;
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
 
  departamentos = [];
  municipios = [];
  filtro_municipios = [];
  logs: string[] = [];
  merge_departamento_municipios = '';
  departamento_opcion = '';
  municipios_opcion = '';
  agendaLive: any;
  @ViewChildren('digitSix') digitSix: any;

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
    private adminFairsService: AdminFairsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private agendasService: AgendasService,
  ) {

    this.fairsService.getCurrentFair().
    then( fair => {
      this.fair = fair;
    },error => {
      this.loading.dismiss();
      this.errors = error;
    });

    this.http.get('assets/data/data-cities.json', { responseType: 'json' })
    .subscribe((data:any) => {
      this.departamentos = data.departamentos;
      this.municipios = data.municipios;
    });

    this.liveStream =   this.route.snapshot.paramMap.get('idLiveStream');
    if(this.liveStream) {
      this.initializeLiveActionBotton() 
    }

  }


  initializeLiveActionBotton() {

    this.agendasService.live().then((response) => {
      
      if(response && response.data) {
        if(this.liveStream == response.data.id) {
          this.agendaLive = response.data;
        }        
      }
    }, errors => {
      console.log(errors);
    })
      .catch(error => {
        console.log(error);
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
    if(environment.production) {
    this.register = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name:['',Validators.required],
      last_name:['',Validators.required],
      documento_tipo:['',Validators.required],
      documento_numero:['',Validators.required],
      email:['',[Validators.email,Validators.required]],
      correo_electronico_adicional:[''],
      numero_celular:['',Validators.required],
      pais_inscripcion:['',Validators.required],
      zona_se_encuentra_en:['',Validators.required],
      zona_se_encuentra_en_otra:[''],
      sexo_se_reconoce_como:['',Validators.required],
      sexo_se_reconoce_como_otro:[''],
      sexo_registro_civil:['',Validators.required],
      sexo_registro_civil_otro:[''],
      cultura_se_reconoce_como:['',Validators.required],
      cultura_se_reconoce_como_otro:[''],
      discapacidad:[''],
      discapacidad_cual:[''],
      relacion_sector_rol:['',Validators.required],
      relacion_sector_rol_otro:[''],
      institucion_vinculo:['',Validators.required],
      codigo_cbu:[''],
      institucion_ubicacion:['',Validators.required],
      escolaridad_nivel:['',Validators.required],
      departamento_opcion:[''],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  else {
    this.register = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name:['asistente',Validators.required],
      last_name:['asistente',Validators.required],
      documento_tipo:['Cédula de ciudadanía colombiana',Validators.required],
      documento_numero:['asistente',Validators.required],
      email:['',[Validators.email,Validators.required]],
      correo_electronico_adicional:[''],
      numero_celular:['asistente',Validators.required],
      pais_inscripcion:['asistente',Validators.required],
      zona_se_encuentra_en:['Zona urbana',Validators.required],
      zona_se_encuentra_en_otra:[''],
      sexo_se_reconoce_como:['Hombre',Validators.required],
      sexo_se_reconoce_como_otro:[''],
      sexo_registro_civil:['Hombre',Validators.required],
      sexo_registro_civil_otro:[''],
      cultura_se_reconoce_como:['Indígena',Validators.required],
      cultura_se_reconoce_como_otro:[''],
      discapacidad:['Ninguna discapacidad/diversidad funcional'],
      discapacidad_cual:['Ninguna discapacidad/diversidad funcional'],
      relacion_sector_rol:['Otro',Validators.required],
      relacion_sector_rol_otro:['Otro'],
      institucion_vinculo:['Otro',Validators.required],
      codigo_cbu:[''],
      institucion_ubicacion:['BOGOTÁ, D.C.',Validators.required],
      escolaridad_nivel:['Bachillerato',Validators.required],
      departamento_opcion:['BOGOTÁ, D.C.'],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

    
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

          if(response.status === 201) {

            this.emailActivateError = true;
            console.log('el correo exite',this.emailActivateError)
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
    this.emailSingConfirm = this.emailSingConfirm;
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

    let result = this.register.value['departamento_opcion']+'||'+this.register.value['institucion_ubicacion'].join(',')
    console.log(result)
    const signupData = {
      'user_name': this.register.value['name'].replace(' ','') + '_' + Date.now(),
      'name': this.register.value['name'],
      'last_name': this.register.value['last_name'],
      'password': this.register.value['password'],
      'email': this.register.value['email'],
      'confirmPassword': this.register.value['confirmPassword'],
      'role_id': 4,
      'fair_id': this.fair.id     ,
      'documento_tipo' : this.register.value['documento_tipo'] ,
      'documento_numero' : this.register.value['documento_numero'] ,
      'correo_electronico_adicional' : this.register.value['correo_electronico_adicional'] ,
      'numero_celular' : this.register.value['numero_celular'] ,
      'pais_inscripcion' : this.register.value['pais_inscripcion'] ,
      'zona_se_encuentra_en' : this.register.value['zona_se_encuentra_en'] ,
      'zona_se_encuentra_en_otra' : this.register.value['zona_se_encuentra_en_otra'] ,
      'sexo_se_reconoce_como' : this.register.value['sexo_se_reconoce_como'] ,
      'sexo_se_reconoce_como_otro' : this.register.value['sexo_se_reconoce_como_otro'] ,
      'sexo_registro_civil' : this.register.value['sexo_registro_civil'] ,
      'sexo_registro_civil_otro' : this.register.value['sexo_registro_civil_otro'] ,
      'cultura_se_reconoce_como' : this.register.value['cultura_se_reconoce_como'] ,
      'cultura_se_reconoce_como_otro' : this.register.value['cultura_se_reconoce_como_otro'] ,
      'discapacidad' : this.register.value['discapacidad'] ,
      'discapacidad_cual' : this.register.value['discapacidad_cual'] ,
      'relacion_sector_rol' : this.register.value['relacion_sector_rol'] ,
      'relacion_sector_rol_otro' : this.register.value['relacion_sector_rol_otro'] ,
      'institucion_vinculo' : this.register.value['institucion_vinculo'] ,
      'codigo_cbu' : this.register.value['codigo_cbu'] ,
      'institucion_ubicacion' : result ,
      'escolaridad_nivel' : this.register.value['escolaridad_nivel'] ,
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

  onLogin(userDataSession, fair_id) {
    this.loading.present({message:'Cargando...'});
    this.usersService.login(userDataSession.email,userDataSession.password, fair_id)
      .subscribe(
        data => {
          const token = data.data;
          this.usersService.setUser(Object.assign(userDataSession,{token:token})).then(() => {
            //this.router.navigateByUrl('/schedule');
            //window.dispatchEvent(new CustomEvent('user:signup'));
            //window.location.href('/');
            
            this.loading.dismiss();            
            window.dispatchEvent(new CustomEvent('user:login', { 'detail': { 
              'showRegister': true,
              'userDataSession': userDataSession, 'liveStream': this.agendaLive }}));

            this.redirectTo(this.fair.redirectTo);
            
            /*if(this.action && this.action.length > 0) {
              window.location.href='/'+this.action;
            } else {
              window.location.href='/';
            }*/
            
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



  pushLog(msg) {
    this.logs.unshift(msg);
    console.log(msg)
  }

  handleChange(e) {
    this.pushLog('ionChange fired with value: ' + e.detail.value);
    let arr = [
      { name:"string 1", value:"this", other: "that" },
      { name:"string 2", value:"this", other: "that" }
    ];

    let obj = this.departamentos.find(o => o.value === e.detail.value);
    let obj_municipios = this.municipios.filter(o => o.departamento_id === obj.id)

    this.filtro_municipios = [];
    this.filtro_municipios.push(...obj_municipios) ;

  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
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
