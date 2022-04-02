import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu-buttons',
  templateUrl: './side-menu-buttons.component.html',
  styleUrls: ['./side-menu-buttons.component.scss'],
})
export class SideMenuButtonsComponent implements OnInit {


  tabMenuOver = null;
  editSave = null;

  constructor() { 
    this.listenForEvents();
  }

  ngOnInit() {}
  
  onSave() {
	  
  }
  
  onSelectPanel(panelName)

  listenForEvents() {
    window.addEventListener('side-menu-button:check-save', (user) => {
      
    }); 
	
	window.addEventListener('addScene:menu', (event:any) => {
      this.addSceneMenu(event.detail.type,event.detail.iScene);
    });	
	
	window.addEventListener('removeScene:menu', (event:any) => {
      this.removeSceneMenu(event.detail.type,event.detail.iScene);
    });
    
    window.addEventListener('user:signup', (user) => {
      setTimeout(() => {
        //this.loggedIn = user !== null;
        window.location.reload();
      }, 300);
    }); 

    window.addEventListener('user:logout', () => {
      //this.updateLoggedInStatus(null);
      //this.getShoppingCart();
      //window.location.reload();
	  window.location.href = window.location.host;
    });
    
    window.addEventListener('user:shoppingCart', () => {
      this.getShoppingCart();
    });

    window.addEventListener('open:shoppingCart', () => {
      this.openShoppingCart();
    }); 

  }


}
