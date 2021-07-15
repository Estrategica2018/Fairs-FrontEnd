import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wompi-payment-button',
  templateUrl: './wompi-payment-button.component.html',
  styleUrls: ['./wompi-payment-button.component.scss'],
})
export class WompiPaymentButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
