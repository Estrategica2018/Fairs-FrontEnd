import { Component, OnInit, Input } from '@angular/core';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements OnInit {

  @Input() scene: any;
  @Input() product: any;
  @Input() mainContainer: any;
  
  constructor() {
  }
  
  ngOnInit() {
    setTimeout(()=>{this.onResize()},30);
  } 
  
  ngAfterViewInit() {
     
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
     
     const main = document.querySelector<HTMLElement>(this.mainContainer);
     if(!this.scene || !main) return;
     //const menu = document.querySelector < HTMLElement > ('.menu-main-content');
     //const offsetWidth = window.innerWidth - menu.offsetWidth;
     const offsetWidth = main.offsetHeight;
     //const top = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
   
     let newWidth = offsetWidth;//main.offsetWidth;
     //const offsetHeight = window.innerHeight - top;
     const offsetHeight = main.offsetHeight;
     //const offsetHeight = main.offsetHeight - top;
     let deltaW =  this.scene.container.w / newWidth;
     let newHeight = newWidth * this.scene.container.h / this.scene.container.w;
     let deltaH = this.scene.container.h / newHeight;
    
     if(newHeight < offsetHeight) {
         //newHeight = window.innerHeight;
         newHeight = main.offsetHeight;
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
        if(banner.border && banner.border.radius > 0){
            banner.border.radius /= deltaH;
        }
     });
     
     //Menu tab resize/render
     //this.menuTabs.initializeMenuTabs(this.tabMenuObj, this.scene.menuTabs.position);
     
     //carrete of images resize/render
     //this.onResizeCarousels();
     
  }

}