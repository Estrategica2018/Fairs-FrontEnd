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

    constructor(
        private router: Router,
        private ref: ChangeDetectorRef) {}

    initializeMenuTabs(tabMenuObj, position) {
        const menu = document.querySelector < HTMLElement > ('.menu-main-content');
        const offsetWidth = window.innerWidth - menu.offsetWidth;
        const top = document.querySelector < HTMLElement > ('.app-toolbar-header').offsetHeight;
        const offsetHeight = window.innerHeight - top;

        let offsetSizeTab = 174; //px
        if (tabMenuObj.actions) {
            tabMenuObj.actions.forEach((action) => {
                offsetSizeTab += 50;
                offsetSizeTab += ((position == 'bottom' || position == 'top') && action.title) ? action.title.length * 6 : 0;
            });
        }

        if (position === 'bottom') {
            this.marginMenuTabs = {
                "x": ((offsetWidth - offsetSizeTab) / 2) + 'px',
                "y": (offsetHeight - 38) + 'px'
            };
        } else if (position === 'top') {
            this.marginMenuTabs = {
                "x": ((offsetWidth - offsetSizeTab) / 2) + 'px',
                "y": '0px'
            };
        } else if (position === 'left') {
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
        let style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'newHeadPanelScene';
        style.innerHTML = '.tabs-menu-scene .head { background-color: ' + tabMenuObj.backgroundColorLogo + '} ';
        style.innerHTML += '.tabs-menu-scene.bottom::before, .tabs-menu-scene.bottom::after {box-shadow: 0 -17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu-scene.bottom .head::before, .tabs-menu-scene.bottom .head::after { box-shadow: 0 -17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
        style.innerHTML += '.tabs-menu-scene.top::before, .tabs-menu-scene.top::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu-scene.top .head::before, .tabs-menu-scene.top .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
        style.innerHTML += '.tabs-menu-scene.right::before, .tabs-menu-scene.right::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu-scene.right .head::before, .tabs-menu-scene.right .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
        style.innerHTML += '.tabs-menu-scene.left::before, .tabs-menu-scene.left::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu-scene.left .head::before, .tabs-menu-scene.left .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
        if(document.querySelector('#newHeadPanelScene'))
        document.getElementsByTagName('head')[0].removeChild(document.querySelector('#newHeadPanelScene'));
        
        document.getElementsByTagName('head')[0].appendChild(style);
    
    }

    onRouterLink(tab) {
        this.router.navigateByUrl('/overflow', {  skipLocationChange: true}
        ).then(() => {
            this.router.navigate([tab]);
        });
    }
}