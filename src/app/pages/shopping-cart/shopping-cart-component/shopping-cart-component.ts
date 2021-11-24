import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { UsersService } from './../../../api/users.service';
import { FairsService } from './../../../api/fairs.service';
import { ShoppingCarts } from './../../../api/shopping-carts.service';
import { PaymentService } from './../../../api/payment.service';
import { LoadingService } from './../../../providers/loading.service';
import { AlertController, ModalController, IonRouterOutlet,ToastController } from '@ionic/angular';
import { environment, SERVER_URL } from '../../../../environments/environment';
 
declare var WidgetCheckout: any;

@Component({
  selector: 'app-shopping-cart-component',
  templateUrl: './shopping-cart-component.html',
  styleUrls: ['./shopping-cart-component.scss'],
})
export class ShoppingCartComponent implements OnInit {

  @Input() fair: any;
  @Input() _continue: any;
  shoppingCarts: any;
  url = SERVER_URL;
  totalAmount = 0;
  userDataSession: any;
  
  constructor(
    private usersService: UsersService,
    private paymentService: PaymentService,
    private alertCtrl: AlertController,
    private fairsService: FairsService,
    private shoppingCartService: ShoppingCarts,
    private loading: LoadingService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loading.present({message:'Cargando...'});
    
    this.usersService.getUser()
      .then((userDataSession)=>{
        
        this.userDataSession = userDataSession;
        
        if(this.userDataSession) {

            this.shoppingCartService.list(this.fair, userDataSession)
            .then((response) => {
              this.shoppingCarts = response;
              this.loadShoppingCart();
              this.loading.dismiss();
            })
            .catch(error => {
              this.loading.dismiss();
            });
        }
        else {
          this.loading.dismiss();
        }
      });
  }
  
  loadShoppingCart() {
      this.totalAmount = 0;
      for(let shoppingCart of this.shoppingCarts){
          this.totalAmount += ( shoppingCart.product_price.price || shoppingCart.product_price.product.price ) * shoppingCart.amount;
          if(shoppingCart.product_price.resources) {
            shoppingCart.product_price.resources.attributesStr = [];
            if(shoppingCart.product_price.resources.attributes && shoppingCart.product_price.resources.attributes.length > 0) 
            for(let attr of shoppingCart.product_price.resources.attributes) {
               if(attr.value && attr.value.length > 0) {
                 shoppingCart.product_price.resources.attributesStr.push({'label':attr.name,'value':attr.value})
               }
            }
          }
      }
  }
  
  
  async presenterDelete(shoppingCart) {
    
      const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borra elemento?',
      subHeader: 'Confirma para eliminar el elemento del carrito de compras',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {
            this.onDeleteShoppingCart(shoppingCart);
          }
        }
      ]
    });
    await alert.present();
    
  }

  
  onDeleteShoppingCart(shoppingCart) {
    this.loading.present({message:'Cargando...'});
    this.shoppingCartService.removeShoppingCart(shoppingCart)
    .then((response) => {
      this.loading.dismiss();
      this.shoppingCarts = this.shoppingCarts.filter((sc,indx)=>{
          //this.shoppingCarts.forEach((shoppingCart)=>{
         return sc.id != shoppingCart.id;
      });
      
      this.loadShoppingCart();
    })
    .catch(error => {
      this.loading.dismiss();
    });    
  }
  
  showPaymentButton() {
      this.loading.present({message:'Cargando...'});
      this.usersService.getUser()
        .then((userDataSession)=>{
          
         this.paymentService.createNewReference({type:'shopping',id: 1},userDataSession)
         .then( (dataReference: any) => {
             this.loading.dismiss();
             const price = this.totalAmount;
             const publicKey = dataReference.publicKey;
             const reference = dataReference.reference;
             const currency = dataReference.currency;
             
            const url = `${this.url}/wompi/pagos/eventos`;
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
         });
      });
  }
  
  closeModal() {
      this.modalCtrl.dismiss();
  }

  addAmount(shoppingCart) {
    if(shoppingCart.amount < 11) {
      
      shoppingCart.amount ++;
      
      this.shoppingCartService.updateShoppingCart(shoppingCart)
      .then( (dataReference: any) => {
         //this.loading.dismiss();
         this.loadShoppingCart(); 
      });
      
    }
  }
  
  removeAmount(shoppingCart) {
    if(shoppingCart.amount > 1 ) {

      shoppingCart.amount --;
      this.shoppingCartService.updateShoppingCart(shoppingCart)
      .then( (dataReference: any) => {
         //this.loading.dismiss();
         this.loadShoppingCart(); 
      });
    }
  }
}
