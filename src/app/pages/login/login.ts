import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from './../../api/users.service';
import { FairsService } from './../../api/fairs.service';
import { LoadingService } from './../../providers/loading.service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
  providers: [UsersService]
})
export class LoginPage {
  login: any = { username: '', password: '' };
  submitted = false;
  errors = null;
  dark = false;

  constructor(
    private router: Router,
    private loading: LoadingService,
    private usersService: UsersService,
      private fairsService: FairsService
  ) {
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

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.loading.present({message:'Cargando...'});
      const username = this.login.username;
      const password = this.login.password;
      this.fairsService.getCurrentFair().
         then( fair => {
          this.usersService.login(username,password, fair.id)
          .subscribe(
            data => {
                this.loading.dismiss();
                const token = data.data;
                this.usersService.setUser(Object.assign({password:password},{token:token},data.user)).then(() => {
                  this.router.navigateByUrl('/app/tabs/schedule');
                  window.dispatchEvent(new CustomEvent('user:login'));
                });
            },
            error => {
                this.loading.dismiss();
                this.errors = error;
          });
        },error => {
                this.loading.dismiss();
                this.errors = error;
          });

    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }

  onRecoverPassword() {
    this.router.navigateByUrl('/recoverPassword');
  }

}
