import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../providers/loading.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  constructor(private loading: LoadingService) { 
    this.loading.present({message:'Cargando...'});
    function twit(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}
    twit(document,"script","twitter-wjs");
  }

  ionViewWillEnter () {
    this.loading.dismiss();
    (<any>window).twttr.widgets.load();
  }
  
  ngOnInit() {
    this.loading.dismiss();
  }

}
