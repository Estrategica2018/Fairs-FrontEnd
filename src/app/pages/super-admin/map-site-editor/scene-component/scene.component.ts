import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HostListener } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-scene-component',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements OnInit {

  constructor() { }

  @Input() scene: any;
  @Input() windowScreenSm: boolean;
  @Input() editMode: boolean = false;
  @Input() router: Router;
  @Input() bannerSelectHover: any;
  @Output() onHoverBanner = new EventEmitter<any>();
  
  ngOnInit() {
	  
  }
  
  goToOnHoverBanner(banner,scene){
	  
	  if(banner && this.editMode) {
		this.onHoverBanner.emit({'banner':banner,'scene':scene});
	  }
	  else if(banner && banner.externalUrl) {
	     const windowReference = window.open();
		 windowReference.location.href = banner.externalUrl;
	  } else if(banner.internalUrl) {
		 this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
           this.router.navigate([banner.internalUrl])
         }); 
	  }

  }
  
  goToOnHoverBannerReciclyer($event) {
	  this.goToOnHoverBanner($event.banner, $event.scene);
  }
  

}
