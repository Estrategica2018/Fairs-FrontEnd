import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab-menu-scenes',
    templateUrl: './tab-menu-scenes.component.html',
    styleUrls: ['./tab-menu-scenes.component.scss'],
})
export class TabMenuScenesComponent {

    @Input() menuTabs: any;
    @Input() editor: any;
    @Input() position: any;
    marginMenuTabs: any;
    _backgroundColorLogo = null;
    _backgroundColor = null;
    onlyIcon = false;

    constructor(
        private router: Router,
        private ref: ChangeDetectorRef) {}

    initializeMenuTabs(tabMenuObj, position) {
        

        
        const menu = document.querySelector < HTMLElement > ('.menu-main-content');
        const offsetWidth = window.innerWidth - menu.offsetWidth;
        const top = document.querySelector < HTMLElement > ('.app-toolbar-header').offsetHeight;
        const offsetHeight = window.innerHeight - top;

        let offsetSizeTab = ( tabMenuObj.icon ) ? 174 : 74; //px
        tabMenuObj.actions = tabMenuObj.actions || [];

        tabMenuObj.actions.forEach((action) => {
            offsetSizeTab += 50;
            offsetSizeTab += ((position == 'bottom' || position == 'top') && action.title) ? action.title.length * 6 : 0;
        });
        
        if (position === 'left') {
            this.marginMenuTabs = {
                "x": '0px',
                "y": ((offsetHeight - offsetSizeTab + 30)) + 'px'
            };
        } else if (position === 'right') {
            this.marginMenuTabs = {
                "x": (offsetWidth - 41) + 'px',
                "y": ((offsetHeight - offsetSizeTab + 30)) + 'px'
            };
        }
         
        //divTabMenu.offsetLeft
        let size = ( tabMenuObj.icon ? 44 : 20);
        
        tabMenuObj.actions.forEach((tab)=>{
            size += ( tab.title.length * 8.5 );
        });
        size += tabMenuObj.actions.length * 50;
        
        this.onlyIcon = false;
        
        let mleft = ( offsetWidth - size ) / 2;
        if( mleft <= 0 ) {
            this.onlyIcon = true;
            size = ( tabMenuObj.icon ? 44 : 20);
            size += tabMenuObj.actions.length * 50;
            mleft = ( offsetWidth - size ) / 2;
        }
        if (position === 'bottom') {
            this.marginMenuTabs = {
                "x": mleft + 'px',
                "y": (offsetHeight - 38) + 'px'
            };
        } else if (position === 'top') {
            this.marginMenuTabs = {
                "x": mleft + 'px',
                "y": '0px'
            };
        }
        
        if(this._backgroundColorLogo != tabMenuObj.backgroundColorLogo || this._backgroundColor != tabMenuObj.backgroundColor)  {
            
            this._backgroundColorLogo = tabMenuObj.backgroundColorLogo;
            this._backgroundColor = tabMenuObj.backgroundColor;
            
            let style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'newHeadPanelScene';
            
            
            if(tabMenuObj.icon) {
              style.innerHTML = '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + ' .head { background-color: ' + tabMenuObj.backgroundColorLogo + '} ';
            }
            else {
              style.innerHTML = '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + ' .head { display: none; } ';
            }
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.bottom::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.bottom::after {box-shadow: 0 -17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.bottom .head::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.bottom .head::after { box-shadow: 0 -17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.top::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.top::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.top .head::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.top .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.right::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.right::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.right .head::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.right .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.left::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.left::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
            style.innerHTML += '.tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.left .head::before, .tabs-menu-scene.tabMenu-id-' + tabMenuObj.id + '.left .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
            if(document.querySelector('#newHeadPanelScene'))
            document.getElementsByTagName('head')[0].removeChild(document.querySelector('#newHeadPanelScene'));
            
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    
    }

    onRouterLink(tab) {
        this.router.navigateByUrl('/overflow', {  skipLocationChange: true}
        ).then(() => {
            this.router.navigate([tab]);
        });
    }
}