import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../api/users.service';
import { LoadingService } from './../../providers/loading.service';
import { FairsService } from './../../api/fairs.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { environment, SERVER_URL } from '../../../environments/environment';


declare var WidgetCheckout: any;

@Component({
  selector: 'app-wompi-payment-layout',
  templateUrl: './wompi-payment-layout.page.html',
  styleUrls: ['./wompi-payment-layout.page.scss'],
})
export class WompiPaymentLayoutPage implements OnInit {

  user: any = null;
  url = SERVER_URL;
  @Input() type;
  @Input() container;
  @Input() objPrice;
  errors = null;
  success = null;
  userDataSession = null;
  
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
        this.userDataSession = userDataSession;
        this.fairsService.getCurrentFair()
        .then( fair => {
          this.user = userDataSession; 
          this.objPrice = fair;
          this.objPrice.resources.detailPayment = [{'name':'Conferencias Públicas','icon':'wifi'}, {'name':'Conferencias exclusivas', 'icon':'ribbon'}];
          this.loading.dismiss();
          this.showPaymentButton();
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
  
  showPaymentButton() {
         this.loading.present({message:'Cargando...'});
         this.usersService.createNewReference({type:this.type,id: this.objPrice.id},this.userDataSession)
         .then( (dataReference: any) => {
             this.loading.dismiss();
             this.errors = null;
             const price = this.objPrice.price + '00';
             const publicKey = dataReference.publicKey;
             const reference = dataReference.reference;
             const currency = dataReference.currency;
             this.success = "Creación exitosa de referencia de pago.";
             
            //const script = document.createElement("script");
            //script.src = 'https://checkout.wompi.co/widget.js';
            //script.setAttribute("data-render", "button");
            //
            //script.setAttribute("data-public-key", publicKey);
            //script.setAttribute("data-currency", currency);
            //script.setAttribute("data-amount-in-cents", price);
            //script.setAttribute("data-reference", reference);
            //
            //const _self = this;
            //script.onload = function() {
            //   _self.loading.dismiss();
            //}
             
             //const content = document.querySelector('.payment-button');
             //content.appendChild(script);

            const url = `${this.url}/viewerZoom/wompi/pagos/eventos`;
            const checkout = new WidgetCheckout({
              currency: currency,
              amountInCents: price + '00',
              reference: reference,
              publicKey: publicKey,
              redirectUrl: url, // Opcional
              taxInCents: { // Opcional
                vat: 1900,
                consumption: 800
              }
            });
           
            checkout.open(function ( result ) {
               const transaction = result.transaction;
               console.log('Transaction ID: ', transaction.id)
               console.log('Transaction object: ', result)
           })
         },
         error => {
              this.loading.dismiss();
              this.errors = error;
              this.success = null;
         });
  }
  
}

