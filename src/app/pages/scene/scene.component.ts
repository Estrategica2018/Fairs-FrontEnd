import { Component, OnInit, Input } from '@angular/core';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements OnInit {

  @Input() scene: any;
  
  constructor() {
  }
  
  ngOnInit() {
  } 
  
  ngAfterViewInit() {
     
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
     
     if(!this.scene) return;
     
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     
     const menu = document.querySelector < HTMLElement > ('.menu-main-content');
     const offsetWidth = window.innerWidth - menu.offsetWidth;
     const top = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
     main.style.top = top + 'px';
   
     let newWidth = offsetWidth;//main.offsetWidth;
     const offsetHeight = window.innerHeight - top;
     let deltaW =  this.scene.container.w / newWidth;
     let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
     let deltaH = this.scene.container.h / newHeight;
    
     if(newHeight < offsetHeight) {
         newHeight = window.innerHeight;
         newWidth = newHeight * this.scene.container.w / this.scene.container.h;
         deltaW =  this.scene.container.w / newWidth;
         deltaH = this.scene.container.h / newHeight;
     }
     this.scene.container.w = newWidth;
     this.scene.container.h = newHeight;
     this.scene.banners.forEach((banner)=>{
        if(banner.size) { 
           banner.size.x /= deltaW;
           banner.size.y /= deltaH;
        }
        if(banner.position) { 
           banner.position.x /= deltaW;
           banner.position.y /= deltaH;
        }
        if(banner.fontSize > 0 ) {
           banner.fontSize /= deltaW;
        }
     });
     
     //Menu tab resize/render
     //this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);
     
     //carrete of images resize/render
     //this.onResizeCarousels();
     
  }

}