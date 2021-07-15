import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { FairsService } from './../../api/fairs.service';
import { UsersService } from './../../api/users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-recover-password',
  templateUrl: 'password.html',
  styleUrls: ['./password.scss'],
})
export class PasswordPage  implements OnInit {
  login: any = { username: '', password: '' };
  changePassword: any = { username: '', newPassrword: '', confirNewPassrword: '' };
  submitted = false;
  success = null;
  errors = null;
  dark = false;
  token = null;
  showPassword = 'password';
  showConfirmPassword = 'password';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private fairsService: FairsService,
    private usersService: UsersService

  ) {
    this.listenForDarkModeEvents();
  }
  
  ngOnInit() {
      this.token = this.route.snapshot.paramMap.get('token');
      if(this.token) {
       this.usersService.findPassword(this.token)
      .then( data => {
          this.loading.dismiss();
          this.errors = null;
          this.changePassword.username = data.data.email;
		  
        },
        error => {
          this.loading.dismiss();
          this.errors = error;
          this.success = null;
		  this.token = null;
        });
      }
  }

  listenForDarkModeEvents() {
    window.addEventListener('dark:change', (e: any) => {
      setTimeout(() => {
        console.log(e);
        this.dark = e.detail;
      }, 300);
    });
  }

  onSendEmailPassword(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.loading.present({ message: 'Cargando...'});
      const username = this.login.username;
      this.fairsService.getCurrentFair().
        then( fair => {
          this.usersService.recoverPassword({"email": username,"origin":window.location.origin})
          .then( data => {
              this.loading.dismiss();
              this.errors = null;
              this.success = data.message;
            },
            error => {
              this.loading.dismiss();
              this.errors = error;
              this.success = null;
            });


      });

    }
  }
  
  onSendChangePassword(changePasswordForm: NgForm) {
    this.submitted = true;

    if (changePasswordForm.valid && (this.changePassword.newPassrword === this.changePassword.confirNewPassrword)) {
      this.loading.present({ message: 'Cargando...'});
      const username = this.login.username;
      this.usersService.findPassword({"email": username,"origin":window.location.origin})
      .then( data => {
          this.loading.dismiss();
          this.errors = null;
          this.success = data.message;
        },
        error => {
          this.loading.dismiss();
          this.errors = error;
          this.success = null;
        });
    }
  }
  
  toggleShowPassword() {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
  }
  
  toggleShowConfirmPassword() {
    this.showConfirmPassword = this.showConfirmPassword === 'password' ? 'text' : 'password';
  }

}
