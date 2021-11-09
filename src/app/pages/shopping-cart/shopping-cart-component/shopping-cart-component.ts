import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FairsService } from './../../../api/fairs.service';
import { ShoppingCarts } from './../../../api/shopping-carts.service';
import { LoadingService } from './../../../providers/loading.service';

@Component({
  selector: 'app-shopping-cart-component',
  templateUrl: './shopping-cart-component.html',
  styleUrls: ['./shopping-cart-component.scss'],
})
export class ShoppingCartComponent implements OnInit {

  @Input() fair: any;
  shoppingCarts: any;
  totalAmount = 0;
  
  constructor(
    private fairsService: FairsService,
    private shoppingCartService: ShoppingCarts,
    private loading: LoadingService,
  ) { }

  ngOnInit() {
    this.loading.present({message:'Cargando...'});
    this.shoppingCartService.list(this.fair)
    .then((response) => {
      this.shoppingCarts = response;
      this.totalAmount = 0;
      this.shoppingCarts.forEach((shoppingCart)=>{
          shoppingCart.product_price.resources.attributesStr = [];
          this.totalAmount += ( shoppingCart.product_price.price ? shoppingCart.product_price.price * shoppingCart.amount : shoppingCart.amount * shoppingCart.product_price.product.price );
          for(let attr in shoppingCart.product_price.resources.attributes) {
             shoppingCart.product_price.resources.attributesStr.push({'label':attr,'value':shoppingCart.product_price.resources.attributes[attr]})
             
          }
          
      });
      this.loading.dismiss();
    })
    .catch(error => {
      this.loading.dismiss();
    });
  }

}
