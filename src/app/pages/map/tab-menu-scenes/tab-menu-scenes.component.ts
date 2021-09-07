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
        style.innerHTML = '.tabs-menu .head { background-color: ' + tabMenuObj.backgroundColorLogo + '} ';
        style.innerHTML += '.tabs-menu.bottom::before, .tabs-menu.bottom::after {box-shadow: 0 -17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu.bottom .head::before, .tabs-menu.bottom .head::after { box-shadow: 0 -17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
        style.innerHTML += '.tabs-menu.top::before, .tabs-menu.top::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu.top .head::before, .tabs-menu.top .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
        style.innerHTML += '.tabs-menu.right::before, .tabs-menu.right::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu.right .head::before, .tabs-menu.right .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
        style.innerHTML += '.tabs-menu.left::before, .tabs-menu.left::after {box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColor + ' !important}';
        style.innerHTML += '.tabs-menu.left .head::before, .tabs-menu.left .head::after { box-shadow: 0 17px 0 0 ' + tabMenuObj.backgroundColorLogo + ' !important;}';
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