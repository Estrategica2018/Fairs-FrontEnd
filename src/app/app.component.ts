	import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HostListener } from "@angular/core";

import { MenuController, Platform, IonNav } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThreeFairService } from './threejs/three.fair.service';
import { FairService } from './api/fair.service';
import { PavilionService } from './api/pavilion.service';
import { StandService } from './api/stand.service';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';

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
  loading = true;
  showPavilionsMenu = false;
  showPavilionsSubMenu = false;
  pavilionsList = [];
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
	private threeFair: ThreeFairService,
    private fairService: FairService,
	private pavilionService: PavilionService,
	private standService: StandService,
	private animationCtrl: AnimationController
  ) {
    this.initializeApp();
	this.devWidth = this.platform.width();
	this.fair = this.fairService.get(null);
	this.fair.type = 'fair';
	this.pavilionsList = this.pavilionService.list(this.fair.id);

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
		 this.showPavilionsMenu = true;
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
		console.log(document.querySelector(".img"));
		const animation = this.animationCtrl.create()
		  .addElement(document.querySelector(".img"))
		  .easing("ease-in-out")
		  .duration(1000)
		  .direction("alternate")
		  .iterations(Infinity)
		  .keyframes([
			{ offset: 0, transform: "scale(1)", opacity: "1" },
			{ offset: 1, transform: "scale(1.5)", opacity: "0.5" }
		  ]);

		animation.play();
		
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
  
  onOpenLocalPavilion(pavilion_id) {
	  pavilion_id = 2;
	  var objSel = this.pavilionService.get(pavilion_id);
	  objSel.type = 'pavilion';
      this.threeFair.initialize(this.container.nativeElement, objSel, this);
  }
  onOpenRoomPavilion(pavilion_id) {
	  var objSel = this.pavilionService.get(pavilion_id);
	  objSel.type = 'room';
      this.threeFair.initialize(this.container.nativeElement, objSel, this);
  }
  
  onOpenStand(stand_id) {
	  var objSel = this.standService.get(stand_id);
	  objSel.type = 'stand';
      this.threeFair.initialize(this.container.nativeElement, objSel, this);
  }
  
  setLoading(loading) {
	  this.loading = loading;
  }
  
}

