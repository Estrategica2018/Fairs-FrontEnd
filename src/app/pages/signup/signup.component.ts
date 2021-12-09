import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Config, ModalController, NavParams } from '@ionic/angular';
//import { IonRouterOutlet } from '@ionic/angular';
import { UsersService } from '../../api/users.service';
import { FairsService } from '../../api/fairs.service';
import { LoadingService } from './../../providers/loading.service';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupComponent implements OnInit {
    
  @Input() _patern: any;
  errors = null;
  dark = false; 
  registerForm: FormGroup;
  submitted = false;
  
  constructor(
    private router: Router,
    private usersService: UsersService,
    private loading: LoadingService,
    private modalCtrl: ModalController,
    //private routerOutlet: IonRouterOutlet,
    private fairsService: FairsService,
    private formBuilder: FormBuilder 
  ) {
    
    //this.listenForDarkModeEvents();
 }
 
 ngOnInit() {
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
  }
  
  get f() { return this.registerForm.controls; }
  
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading.present({message:'Cargando...'});
      
      this.fairsService.getCurrentFair().
      then( fair => {
          const signupData = {
            'user_name': this.registerForm.value['name'].replace(' ','') + '_' + Date.now(),
            'name': this.registerForm.value['name'],
            'last_name': this.registerForm.value['last_name'],
            'password': this.registerForm.value['password'],
            'email': this.registerForm.value['email'],
            'confirmPassword': this.registerForm.value['confirmPassword'],
            'role_id': 4,
            'fair_id': fair.id
          }
          this.usersService.signup(signupData)
          .then(
            data => {
                if(data.success === 201) {
                    this.loading.dismiss();
                    this.onLogin(Object.assign({password:this.registerForm.value['password']}, data.data), fair.id);
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
  
  listenForDarkModeEvents() {
    window.addEventListener('dark:change', (e:any) => {
      setTimeout(() => {
       this.dark = e.detail;
      }, 300);
    });
  }

  
  onLogin(userData, fair_id) {
      this.usersService.login(userData.email,userData.password, fair_id)
      .subscribe(
        data => {
            const token = data.data;
            this.usersService.setUser(Object.assign(userData,{token:token})).then(() => {
              this.router.navigateByUrl('/schedule');
              window.dispatchEvent(new CustomEvent('user:signup'));
            });
        },
        error => {
            this.errors = error;
      });
  }
  
  presentTermsModal() {
    this._patern.presentTermsModal();
  }
  
  closeModal() {
    this.modalCtrl.dismiss();
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