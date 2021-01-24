import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HostListener } from "@angular/core";

import { MenuController, Platform, IonNav } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThreeFairService } from './threejs/three.fair.service';
import { FairService } from './api/fair.service';
import { PavilionService } from './api/pavilion.service';
import { Router } from '@angular/router';
import { Events } from 'ionic-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
	
  @ViewChild('mySubNav', {static: true}) myNav: IonNav;	
  selectedIndex = 'main';
  menuOpen = false;
  fair: any;
  devWidth: any;
  
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
	private threeFair: ThreeFairService,
    private fairService: FairService,
    private router: Router,
	private pavilionService: PavilionService
  ) {
    this.initializeApp();
	this.fair = this.fairService.get(null);
	this.fair.type = 'fair';	
	this.devWidth = this.platform.width();
  }
  
  @ViewChild('container') container: ElementRef;

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  onMainMenuToggle() {
	  this.threeFair.initialize(this.container.nativeElement, this.fair, this);
  }
  
  onNavMenuChange(type, id)  {
	  if(type === 'main') {
	     this.selectedIndex = 'main';
	  }
	  else if(type === 'pavilion') {
	     this.selectedIndex = 'pavilion_id_' + id;
	  }
  }
  
  onSpeakers() {
	this.router.navigateByUrl('feria/'+this.fair.name+'/speakers');	
    this.selectedIndex = 'speakers';
  }
  
  onOpenTab(page,index) {
	this.myNav.setRoot(page, {});
	this.selectedIndex = index;
  }

  ngOnInit() {
	//this.onResize(null);
	var idInterval = setInterval(() => {
		clearInterval(idInterval);
		
		this.threeFair.initialize(this.container.nativeElement, this.fair, this);
		
	}, 2000);
  }
  
  @HostListener('window:resize', ['$event'])
	onResize(event) {
	  this.menuOpen = document.getElementsByClassName('backdrop-no-scroll').length > 0;
	  this.devWidth = this.platform.width();
  }
  
  onMenuBotton() {
	  var idInterval = setInterval(() => {
		clearInterval(idInterval);
		
		this.menuOpen = document.getElementsByClassName('backdrop-no-scroll').length > 0;
		
	}, 2000);
  }
  
  onOpenPavilion(pavilion_id) {
	  var objSel = this.pavilionService.get(pavilion_id);
      this.threeFair.initialize(this.container.nativeElement, objSel, this);
	  
  }
}

