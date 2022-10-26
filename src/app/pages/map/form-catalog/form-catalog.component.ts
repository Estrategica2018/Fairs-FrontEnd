import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form-catalog',
  templateUrl: './form-catalog.component.html',
  styleUrls: ['./form-catalog.component.scss'],
})
export class FormCatalogComponent implements OnInit {

  @Input() formCatalog: any;
  @Input() banner: any;
  @Input() fair: any;
  @Input() _parent: any;
  @Input() userDataSession: any;


  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,) { }

  ngOnInit() {
    
    if (this.userDataSession) {
      this.registerForm = this.formBuilder.group({
        name: [this.userDataSession.user_name + ' '  + this.userDataSession.last_name  , Validators.required],
        email: ['', Validators.required],
        message: ['', Validators.required],
        subject: ['', Validators.required]
      });
    } else {
      this.registerForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        message: ['', Validators.required],
        subject: ['', Validators.required]
      });
    }
  }

  sendForm(registerForm) {

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
