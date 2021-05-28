import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-panel-editor',
  templateUrl: './panel-editor.component.html',
  styleUrls: ['./panel-editor.component.scss'],
})
export class PanelEditorComponent implements OnInit {

  @Input() scene: any;
  sceneSelect: any;
  constructor() { }

  ngOnInit() {
	  this.sceneSelect = this.scene;
	  console.log(this.sceneSelect);
  }

}
