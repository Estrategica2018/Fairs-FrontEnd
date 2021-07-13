import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { FairsService } from './../../api/fairs.service';
import { UsersService } from './../../api/users.service';

@Component({
  selector: 'page-recover-password',
  templateUrl: 'password.html',
  styleUrls: ['./password.scss'],
})
export class PasswordPage {
  login: any = { username: '', password: '' };
  submitted = false;
  errors = null;
  dark = false;

  constructor(
    private router: Router,
    private loading: LoadingService,
    private fairsService: FairsService,
    private usersService: UsersService

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

  onSendEmailPassword(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.loading.present({ message: 'Cargando...'});
      const username = this.login.username;
       this.fairsService.getCurrentFair().
        then( fair => {
          this.usersService.recoverPassword(username, fair.id)
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


      });

    }
  }
}
