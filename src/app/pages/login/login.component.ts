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
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss']
})
export class  LoginComponent  implements OnInit {
  
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
  registerForm: FormGroup;
  recoveryForm: FormGroup;
  singupConfirmForm: FormGroup;
  userDataSession: any;
  profileRole: any;
  singupConfirmMsg: any;
  emailActivateError: any;
  emailSingConfirm: any;
  
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
    private adminFairsService: AdminFairsService

  ) {
    
    this.usersService.getUser().then((userDataSession: any)=>{
      this.userDataSession = userDataSession;    
      if(userDataSession && userDataSession.user_roles_fair)  {
        this.profileRole = {};
        userDataSession.user_roles_fair.forEach((role)=>{
            if(role.id == 1) { //"super_administrador"
               this.profileRole.admin = true;
            }
         });
         
      }
    });
    
    
    this.fairsService.getCurrentFair().
    then( fair => {
        this.fair = fair;
    },error => {
        this.loading.dismiss();
        this.errors = error;
    });

  }
  
 ngOnInit() {
     this.showMenu = this.showMenu || 'login';    
     
     if(this.showMenu === 'singupConfirm') {
       this.singupConfirmMsg = `Ingresa el código de verificación enviado al correo electrónico ${this.email_recovery}`;
       this.showConfirmAccount = true;
     }
     
     this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
     
     this.recoveryForm = this.formBuilder.group({
        email: [ (this.email_recovery || ''), [Validators.required, Validators.email]]
     });

     this.singupConfirmForm = this.formBuilder.group({
        item1: ['', [Validators.required, Validators.maxLength(1)]],
        item2: ['', [Validators.required, Validators.maxLength(1)]],
        item3: ['', [Validators.required, Validators.maxLength(1)]],
        item4: ['', [Validators.required, Validators.maxLength(1)]],
        item5: ['', [Validators.required, Validators.maxLength(1)]],
        item6: ['', [Validators.required, Validators.maxLength(1)]]
     });
     
     this.loginForm = this.formBuilder.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]],
     });
  }
  
  ngDoCheck(){
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  ngOnDestroy(): void {
     if(this.modal) { this.modal.dismiss(); }
  }

  listenForDarkModeEvents() {
      window.addEventListener('dark:change', (e:any) => {
      setTimeout(() => {
        console.log(e);
       this.dark = e.detail;
      }, 300);
    });
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }

  onRecoverPassword() {
    this.router.navigateByUrl('/recoverPassword');
  }

  presentSignup() {
    this._parent.presentSignup();
  } 

  closeModal() {
    this.modalCtrl.dismiss();
  }
  
  get l() { return this.loginForm.controls; }
  get f() { return this.registerForm.controls; }
  get g() { return this.recoveryForm.controls; }
  get sc() { return this.singupConfirmForm.controls; }
  
  onLoginSubmit() {
    this.submitted = true;
    this.errors = null;
    this.success = null;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading.present({message:'Cargando...'});
      this.fairsService.getCurrentFair().
      then( fair => {
          const password = this.loginForm.value['password'];
          const email = this.loginForm.value['email'];
          const fairId = this.fair.id || this.fair.name;
          
          
          this.usersService.login(email,password, fairId)
          .subscribe(
            data => {

                this.loading.dismiss();
                const token = data.data;
                const auth = data.auth;
                let user = Object.assign({token:token},data.user);
                user = Object.assign({auth:auth},user);
                this.usersService.setUser(user).then(() => {
                  this.router.navigateByUrl('/schedule');
                  window.dispatchEvent(new CustomEvent('user:login'));
                });
            },
            error => {
                this.loading.dismiss();
                this.errors = error;
            });
      },
      error => {
         this.loading.dismiss();
         this.errors = error;
      });
  }

  onRegisterSubmit() {
    this.submitted = true;
    this.errors = null;
    this.success = null;
    this.emailActivateError = null;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading.present({message:'Cargando...'});
      
    this.usersService.findEmail(this.registerForm.value['email'])
    .then( response => {
        
      if(response.status === 201) {
        this.emailActivateError = true;
        this.loading.dismiss();
      }
      else {
        this.emailActivateError = false;
        //this.loading.dismiss();
        this.emailSingConfirm = this.registerForm.value['email'];
        this.onSendSignConfirm(this.emailSingConfirm, this.fair.name);
      }
    },
    error => {
      this.loading.dismiss();
      this.errors = error;
    });
  }
  
  onRecoverySubmit() {
    this.submitted = true;
    this.errors = null;
    this.success = null;

    // stop here if form is invalid
    if (this.recoveryForm.invalid) {
        return;
    }

    this.loading.present({message:'Cargando...'});
      
      this.fairsService.getCurrentFair().
      then( fair => {
          const recoveryData = {
            'email': this.recoveryForm.value['email'],
            'fair_id': fair.id,
            'origin': window.location.origin
          }
          this.usersService.recoverPassword(recoveryData)
          .then(
            data => {
                if(data.success === 201) {
                    this.loading.dismiss();
                    this.success = data.message;
                    this.presentToast(this.success, 'success');
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
              window.location.reload();
            });
        },
        error => {
            this.loading.dismiss();
            this.errors = error;
      });
  }
  
  onSendEmailPassword() {
      
  }
 
  onCreateRegister() {    
    //this.showMenu = 'singup'; 
    this.closeModal()
    this.router.navigateByUrl('/user-register');
    this.submitted = false;
    this.errors = null;
    this.success = null;
  }

  onShowTerms() {
    this.showMenu = 'terms';
  }
  
  async presentActionAdd() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tipo de elemento a agregar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'imagen',
        role: 'destructive',
        icon: 'image-outline',
        handler: () => {
          this.onAddImg();
        }
      }, {
        text: 'Video',
        icon: 'albums-outline',
        handler: () => {
          this.onAddVideo();
        }
      }, {
        text: 'Parrafo',
        icon: 'browsers-outline',
        handler: () => {
          this.onAddParagraph();
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }
  
  async onAddImg(){
    
    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa la ruta de la imagen",
      inputs: [
        {
          name: 'url',
          value: 'https://dummyimage.com/225x105/EFEFEF/000.png',
          placeholder: 'Url'
        },
        {
          name: 'title',
          value: 'Título de imagen'
        },
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Agregar', 
         role: 'destructive', 
         handler: (data) => {
          this.fair.resources.terms = this.fair.resources.terms || {'elements': []};
          this.fair.resources.terms.elements.push({'url':data.url,'title':data.title});
          this.saveFair('Agregar imagen');
         }
        }]
    });
    await actionAlert.present();

  }  

  
  async onAddVideo(){
    
    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa la ruta del video",
      inputs: [
        {
          name: 'videoUrl',
          value: 'https://player.vimeo.com/video/286898202',
          placeholder: 'Url Video'
        },
        {
          name: 'title',
          value: 'Título del video'
        },
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Agregar', 
         role: 'destructive', 
         handler: (data) => {
           this.fair.resources.terms = this.fair.resources.terms || {'elements': []};
           const sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(data.videoUrl);
           this.fair.resources.terms.elements.push({'video':{'videoUrl':data.videoUrl,'sanitizer': sanitizer},'title':data.title});
           this.saveFair('Agregar video');
         }
        }]
    });
    await actionAlert.present();
  } 

  async onAddParagraph(){
    
    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa el Párrafo",
      inputs: [
        {
          type: 'textarea',
          name: 'paragraph',
          placeholder: 'Párrafo'
        }
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Agregar', 
         role: 'destructive', 
         handler: (data) => {
           this.fair.resources.terms = this.fair.resources.terms || {'elements': []};
           this.fair.resources.terms.elements.push({'paragraph':data.paragraph});
           this.saveFair('Agregar Párrafo');
         }
        }]
    });
    await actionAlert.present();
  }  
  
  saveFair(action) {
  
   this.loading.present({message:'Cargando...'});
   
   const fairObj = Object.assign({},this.fair);
   this.adminFairsService.updateFair(fairObj).
      then( response => {
        this.presentToast('Acción '+action+' exitosa', 'success');
        this.loading.dismiss(); 
      }, errors => {
          this.errors = `Consultando el servicio para modificar feria`;
          this.loading.dismiss();
      })
    .catch(error => {
       this.loading.dismiss(); 
       this.presentToast('Acción '+action+' generó error', 'danger');
     });      
  }


  async presentToast(msg,color) {
    const toast = await this.toastCtrl.create({
      message: msg,
      //color: color,
      duration: 3000,
      position: 'bottom'
    });  
    toast.present();
  }
  
  onDeleteItemAdded(index){
      this.fair.resources.terms.elements = this.fair.resources.terms.elements.filter((item, ind)=>{
          return ind != index;
     });
     this.saveFair('Borrar elemento');
  }
  
  onSendSignConfirm(email, fairName) {
    
    //this.loading.present({message:'Cargando...'});
    
    this.usersService.sendSignConfirm(email, fairName)
    .then(data => {
        
        this.singupConfirmMsg = "";
        
        if(data.success === 201) {
            this.loading.dismiss();
            this.showMenu = 'singupConfirm';
            this.submitted = null;
            this.errors = null;
            this.showConfirmAccount = true;
            this.singupConfirmMsg = `Hemos enviado un correo electrónico a ${email} con el código de verificación`;
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
    'user_name': this.registerForm.value['name'].replace(' ','') + '_' + Date.now(),
    'name': this.registerForm.value['name'],
    'last_name': this.registerForm.value['last_name'],
    'password': this.registerForm.value['password'],
    'email': this.registerForm.value['email'],
    'confirmPassword': this.registerForm.value['confirmPassword'],
    'role_id': 4,
    'fair_id': this.fair.id
    }
    this.usersService.signup(signupData)
    .then(data => {
        if(data.success === 201) {
            this.loading.dismiss();
            this.onLogin(Object.assign({password:this.registerForm.value['password']}, data.data), this.fair.id);
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