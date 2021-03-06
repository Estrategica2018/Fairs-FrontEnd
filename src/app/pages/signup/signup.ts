import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { AlertController, IonRouterOutlet } from '@ionic/angular';

import { UsersService } from '../../api/users.service';
import { FairsService } from '../../api/fairs.service';
import { LoadingService } from './../../providers/loading.service';
import { TermsPage } from './../terms/terms.page';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
    
  errors = null;
  dark = false; 
  noPasswordEquals = false;
  
  signupForm = new FormGroup({
     name: new FormControl('123123', Validators.compose([
        Validators.maxLength(191),
        Validators.minLength(5),
        Validators.pattern('^[A-Za-z0-9? ]+$'),
        Validators.required
    ])),
    last_name: new FormControl('sdfasdf', Validators.compose([
        Validators.maxLength(191),
        Validators.minLength(5),
        Validators.pattern('^[A-Za-z0-9? ]+$'),
        Validators.required
    ])),
    email: new FormControl('asdfasdf@asdf.com1', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
     password: new FormControl('asdfasdfasdf', Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(5),
        Validators.pattern('^[A-Za-z0-9? ]+$'),
        Validators.required
    ])),
     confirmPassword: new FormControl('asdfasdfasdf', Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(5),
        Validators.pattern('^[A-Za-z0-9? ]+$'),
        Validators.required
    ])),
    terms: new FormControl(false, Validators.pattern('true'))
  },
  {
    //validator: PasswordValidator.isMatching
  });
  
  events = [
        { type: 'required', message: 'El campo es requerido' },
        { type: 'minlength', message: 'Longitud muy corta' },
        { type: 'maxlength', message: 'Longitud muy larga' },
        { type: 'pattern', message: 'Formato no válido' },
        { type: 'areEqual', message: 'Campos no coinciden' }
  ]
  validation_messages = null;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private loading: LoadingService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private fairsService: FairsService
  ) {
    
    this.validation_messages = {
      'user_name': this.events, 'name': this.events,'last_name': this.events,'email': this.events,'password': this.events, 'confirmPassword': this.events, 
      'terms': Object.assign(this.events,{ type: 'pattern', message: 'Aceptación de términos requerida'} )    
    } 
    
    this.listenForDarkModeEvents();
  }
  
  listenForDarkModeEvents() {
      window.addEventListener('dark:change', (e:any) => {
      setTimeout(() => {
        console.log(e);
       this.dark = e.detail;
      }, 300);
    });
  }

  onSignup(form: NgForm) {
   
    if (form.valid) {
      
      if(this.signupForm.value['password'] !== this.signupForm.value['confirmPassword'] ) { 
         this.noPasswordEquals = true;
         return;
      }
      
      this.noPasswordEquals = false;
      this.loading.present({message:'Cargando...'});
      
      this.fairsService.setCurrentFair().
      then( fair => {
          const signupData = {
            'user_name': this.signupForm.value['name'].replace(' ','') + '_' + Date.now(),
            'name': this.signupForm.value['name'],
            'last_name': this.signupForm.value['last_name'],
            'password': this.signupForm.value['password'],
            'email': this.signupForm.value['email'],
            'confirmPassword': this.signupForm.value['password'],
            'role_id': 4,
            'fair_id': fair.id
          }
          this.usersService.signup(signupData)
          .then(
            data => {
                if(data.success === 201) {
                    this.loading.dismiss();
                    this.onLogin(Object.assign({password:this.signupForm.value['password']}, data.data));
                }
                else {
                    this.loading.dismiss();
                    if(data.email) {
                      this.errors = 'Correo electrónico ya registrado';
                    }
                    else {
                        this.errors = 'Consumiendo el servicio para creación del usuario';
                    }
                }
            },
            error => {
                this.loading.dismiss();
                this.errors = error;
          });
      });
    }
  }
  
  onLogin(userData) {
      this.usersService.login(userData.email,userData.password)
      .subscribe(
        data => {
            const token = data.data;
            this.usersService.setUser(Object.assign(userData,{token:token})).then(() => {
              this.router.navigateByUrl('/app/tabs/schedule');
              window.dispatchEvent(new CustomEvent('user:signup'));
            });
        },
        error => {
            this.errors = error;
      });
  }
  
  async presentTermsModal() {
    const modal = await this.modalCtrl.create({
      component: TermsPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }
}

