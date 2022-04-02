import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HostListener } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-component',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  constructor() { }

  @Input() scene: any;
  @Input() windowScreenSm: boolean;
  @Input() windowScreenLg: boolean;
  @Input() editMode: boolean = false;
  @Input() layoutColSel: any;
  @Input() router: Router;	
  @Output() onHoverBanner = new EventEmitter<any>();
  @Output() click = new EventEmitter<any>();
  
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

  goToclick(col,row,scene) {
	this.click.emit({'layoutColSel':col,'layoutRowSel':row, 'layoutSceneSel':scene});
  } 
  
  goToclickSub($event) {
	console.log($event);
	this.click.emit($event);
  }

  addCol(colSelected) {
	let newCols = [];
    for(let i=0, row = null; i<this.scene.rows.length; i++) {
		row = this.scene.rows[i];
		for(let j=0, col = null; j< row.cols.length; j++) {
            col = row.cols[j];
			if(col.id == colSelected.id) {
				for(let k=0; k<=j; k++) {
				    newCols.push(row.cols[k]);
				}
				
				newCols.push({ 'banners':[], 'id': this._getId() });
				
				for(let k=j+1; k<row.cols.length; k++) {
				    newCols.push(row.cols[k]);
				}
				row.cols = newCols;
				return;
			}
		}
	}
  }

  addRow(colSelected, parent) {
	let newRows = [];
	for(let i=0, row = null; i<parent.rows.length; i++) {
		row = this.scene.rows[i];
		for(let j=0, col = null; j< row.cols.length; j++) {
            col = row.cols[j];
			if(col.id == colSelected.id) {
				
				for(let k=0; k<=i; k++) {
				    newRows.push(parent.rows[k]);
				}
				
				newRows.push({ 'cols':[{'banners':[], 'id': this._getId()}], 'id': this._getId() });
				
				for(let k=i+1; k< parent.rows.length; k++) {
				    newRows.push(parent.rows[k]);
				}
				parent.rows = newRows;
				return;
			}
		}
	}
  }
  
  _getId() {
    return new Date().valueOf() + Math.floor(Math.random() * (100 + 1));
  }

}
