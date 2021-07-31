import { Component, OnInit, Input, SimpleChanges, OnChanges, Output } from '@angular/core';
import { UsersService } from './../../api/users.service';
import { WompiPaymentLayoutComponent } from '../wompi-payment-layout/wompi-payment-layout.component';
import { AlertController, ModalController,IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'wompi-payment-button',
  templateUrl: './wompi-payment-button.component.html',
  styleUrls: ['./wompi-payment-button.component.scss'],
})
export class WompiPaymentButtonComponent implements OnChanges {

  @Input() type: string;
  @Input() obj: any;
  @Output() errors: any; 
  
  showRegister: boolean = false;
  showPayment: boolean = false;
  showAvailableAcess: boolean = false;
  
  constructor(
     private usersService: UsersService,
     private routerOutlet: IonRouterOutlet,
     private modalCtrl: ModalController
  ) {  
    
  } 
  
  ngOnChanges(changes: SimpleChanges) {
   
  if(this.type == 'Fair' && this.obj  ) {
        if(this.obj.price > 0) {
           this.validatePayment();
           this.usersService.getUser().
              then( user => {
                if(user) {
                   this.showRegister = false;
                   this.showPayment = true;
                   
                } else {
                    this.showRegister = true;
                }
              },error => {
                 this.errors = `Consultando el servicio para agenda [${error}]`;
              });
              
           
        }
    }
  }

  validatePayment() {
      
      var script = document.createElement("script");
    script.src = 'https://checkout.wompi.co/widget.js';
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", "pub_test_EbunIjUmrCtIyrh28fFqr9sFUVqI43XA");
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-amount-in-cents", "4950000");
    script.setAttribute("data-reference", "4XMPGKWWPKWQ");
    
    var content = document.querySelector('.payment-button');
    content.appendChild(script);
      
  }
  async openTemplateFair() {
    const modal = await this.modalCtrl.create({
      component: WompiPaymentLayoutComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
          'obj_id': this.obj.id
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if(data) {
        
     
        
    }
  } 

}

