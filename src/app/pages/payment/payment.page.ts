import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FairsService } from '../../api/fairs.service';
import { ShoppingCartsService } from '../../api/shopping-carts.service';
import { UsersService } from '../../api/users.service';
import { LoadingService } from '../../providers/loading.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  referenceId: any;
  userDataSession: any;
  fair: any;
  shoppingCartCount: any;
  shoppingCarts: any;
  errors: any;
  success: any;
  
  
  constructor(
    private route: ActivatedRoute,
    private loading: LoadingService,
    private fairsService: FairsService,
    private shoppingCartsService: ShoppingCartsService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
      this.referenceId = this.route.snapshot.paramMap.get('referenceId');
      this.getShoppingCart();
  }

  ngDoCheck(){
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  getShoppingCart() {
      this.loading.present({message:'Cargando...'});
      
      this.fairsService.getCurrentFair().then((fair)=>{
        this.fair = fair;
        this.usersService.getUser().then((userDataSession)=>{ 
            this.shoppingCartsService.find(this.fair, this.referenceId, userDataSession)
            .then( response => {
              this.shoppingCartCount = response.length;
              this.success = 'Tu pago ha sido registrado exitósamente, te enviamos un correo con el resumen de tu compra';

              this.shoppingCarts = response;
              
              this.loading.dismiss();
            }, errors => {
              this.errors = errors;
              this.loading.dismiss();
            })
            .catch(error => {
              this.errors = error; 
              this.loading.dismiss();
            }); 
        });
        
      }, error => {
        this.loading.dismiss();
        console.log(error);
        this.errors = `Consultando el servicio del mapa general de la feria [${error}]`;
      });

  }
  
}
