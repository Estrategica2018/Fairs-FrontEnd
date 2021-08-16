import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../api/users.service';
import { LoadingService } from './../../providers/loading.service';
import { FairsService } from './../../api/fairs.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-wompi-payment-layout',
  templateUrl: './wompi-payment-layout.page.html',
  styleUrls: ['./wompi-payment-layout.page.scss'],
})
export class WompiPaymentLayoutPage implements OnInit {

  user: any = null;
  @Input() type;
  @Input() container;
  @Input() objPrice;
  errors = null;
  success = null;
  
  constructor(
     private usersService: UsersService,
     private loading: LoadingService,
     private fairsService: FairsService,
     private router: Router,
     private modalCtrl: ModalController
  ) { }

  ngOnInit() {
      
    this.loading.present({message:'Cargando...'});
    
    this.usersService.getUser()
    .then((userDataSession)=>{
        this.fairsService.getCurrentFair()
        .then( fair => {
          if(userDataSession) {
             this.user = userDataSession; 
             this.usersService.createNewReference({type:this.type,id: this.objPrice.id},userDataSession)
             .then( (dataReference: any) => {
                 this.loading.dismiss();
                 this.errors = null;
                 const price = this.objPrice.price * 100;
                 const publicKey = dataReference.publicKey;
                 const reference = dataReference.reference;
                 const currency = dataReference.currency;
                 this.showPaymentButton(publicKey,price,reference,currency);
                 this.success = "Creación exitosa de referencia de pago.";
             },
             error => {
                  this.loading.dismiss();
                  this.errors = error;
                  this.success = null;
             });
          }
          else {
              this.loading.dismiss();
          }
          this.objPrice = fair;
          this.objPrice.resources = [{'name':'Conferencias Públicas','icon':'wifi'}, {'name':'Conferencias exclusivas', 'icon':'ribbon'}];
          
        },error => {
          this.errors = error;
          this.loading.dismiss();
        });
    },error => {
       this.errors = error;
       this.loading.dismiss();
    });
  }

  onSignup() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/signup');
  }
  
  onSignin() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/login');
  }
  
  onClose() {
     this.modalCtrl.dismiss();
  }
  
  showPaymentButton(publicKey,price,reference,currency) {
    const script = document.createElement("script");
    script.src = 'https://checkout.wompi.co/widget.js';
    script.setAttribute("data-render", "button");

    script.setAttribute("data-public-key", publicKey);
    script.setAttribute("data-currency", currency);
    script.setAttribute("data-amount-in-cents", price);
    script.setAttribute("data-reference", reference);

    const _self = this;

    script.onload = function() {
       _self.loading.dismiss();
    }
    
    const content = document.querySelector('.payment-button');
    content.appendChild(script);

    
  }
}

