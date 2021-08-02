import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck(){
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
}
