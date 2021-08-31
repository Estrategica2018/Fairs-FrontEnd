import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-menu-scenes',
  templateUrl: './tab-menu-scenes.component.html',
  styleUrls: ['./tab-menu-scenes.component.scss'],
})
export class TabMenuScenesComponent implements OnInit {

  marginMenuTabs = { x: '50%', y: '0'};
  @Input() options: any;
  @Input() editor: any;
  @Input() position: any;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef) {
    
  }

  ngDoCheck(){
    this.initializeMenu();  
  }
    
  ngOnInit() {
    this.render();
  }
  
  initializeMenu() {
	  
     const tabsmenu = document.querySelector<HTMLElement>('.tabs-menu');
     const main = document.querySelector<HTMLElement>('#ionContent');
     const top = document.querySelector<HTMLElement>('.app-toolbar-header').offsetHeight;
     
     if(tabsmenu && tabsmenu.offsetWidth > 0) {
         this.marginMenuTabs.x = ((main.offsetWidth - tabsmenu.offsetWidth) / 2) + 'px';
         this.marginMenuTabs.y = ( window.innerHeight - top - 38 )+'px';
     }
     else {
         //setTimeout(function(){ this.initializeMenu(); }, 3000);
     }
  }
  
  render() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.tabs-menu.bottom::before, .tabs-menu.bottom::after {box-shadow: 0 -17px 0 0 '+this.options.backgroundColor+' !important}';
    style.innerHTML += '.tabs-menu .head { background-color: ' + this.options.backgroundColorLogo + '} ';
    style.innerHTML += '.tabs-menu.bottom .head::before, .tabs-menu.bottom .head::after { box-shadow: 0 -17px 0 0 ' + this.options.backgroundColorLogo + ' !important;}';
    
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  onRouterLink(tab) {
    this.router.navigate([tab]);
  }
}


