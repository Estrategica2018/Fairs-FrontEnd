import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  constructor() { }

  ngOnInit() {
	  
	document.getElementsByClassName('container')[0].classList.add("display-none");
	document.getElementsByClassName('loading')[0].classList.add("display-none");
	if(document.getElementsByTagName('canvas')[0])
	document.getElementsByTagName('canvas')[0].style.height = '0px';
	  
	!function(d,s,id){
		var js: any,
			fjs=d.getElementsByTagName(s)[0],
			p='https';
		if(!d.getElementById(id)){
			js=d.createElement(s);
			js.id=id;
			js.src=p+"://platform.twitter.com/widgets.js";
			fjs.parentNode.insertBefore(js,fjs);
		}
	}
	(document,"script","twitter-wjs");
  }

}
