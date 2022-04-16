import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu-buttons',
  templateUrl: './side-menu-buttons.component.html',
  styleUrls: ['./side-menu-buttons.component.scss'],
})
export class SideMenuButtonsComponent implements OnInit {

  layoutModel = false;
  editSave = true;
  editMode = true;
  themeSelected = null;
  
  themeList = [
    {'name':'blue','backgroundColor': '#1ABACC','fontColor':'rgb(255, 255, 255)','textColor':'black' },
    {'name':'black','backgroundColor':'black','fontColor':'white','textColor':'white' },
    {'name':'green','backgroundColor':'white','fontColor': '#98A000','textColor':'black' },
  ];
  
  constructor() { 
    this.listenForEvents();
	this.onSetTheme(this.themeList[0]);
  }

  ngOnInit() {
	this.layoutModel = false;
	this.editSave = false;
  }
  
  onSave() {
	if(this.editSave) {
	  window.dispatchEvent(new CustomEvent('side-menu-button:onSave'));
	}
	
	this.onSelectPanel('none');
  }
  
  onSelectPanel(panelName) {
	window.dispatchEvent(new CustomEvent('side-menu-button:select-panel-' + panelName));
  }

  onToogleLayoutModel() {
	if(this.layoutModel) {
	  window.dispatchEvent(new CustomEvent('side-menu-button:layout-model-off'));
	}
	else {
	  this.onHidePreview();
	  window.dispatchEvent(new CustomEvent('side-menu-button:layout-model-on'));
	}
  }
  
  listenForEvents() {
    
	window.addEventListener('side-menu-button:edit-save-on', () => {
       this.editSave = true;	
    });	

	window.addEventListener('side-menu-button:edit-save-off', () => {
       this.editSave = false;
    });	
	
	window.addEventListener('side-menu-button:layout-model-on', () => {
       this.layoutModel = true;
	   this.onHidePreview();
    });
	
	window.addEventListener('side-menu-button:layout-model-off', () => {
       this.layoutModel = false;
    });
  }

  onShowPreview() {
	this.editMode = false;
	this.layoutModel = false;
	window.dispatchEvent(new CustomEvent('side-menu-button:layout-model-off'));
	window.dispatchEvent(new CustomEvent('side-menu-button:edit-mode-off'));	  
  }

  onHidePreview() {
	this.editMode = true;
	window.dispatchEvent(new CustomEvent('side-menu-button:edit-mode-on'));
  }
  
  onSetTheme(theme) {
	this.themeSelected = theme;
	window.dispatchEvent(new CustomEvent('side-menu-button:set-theme',{ detail: { 'theme': theme } } ));
  }

}
