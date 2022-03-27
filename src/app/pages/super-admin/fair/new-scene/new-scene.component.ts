import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-scene',
  templateUrl: './new-scene.component.html',
  styleUrls: ['./new-scene.component.scss'],
})
export class NewSceneComponent implements OnInit {

  @Input() _parent: any;
  @Input() userDataSession: string;
  
  sceneTemplatesTypes = [
  {'label': 'Libre','template':'blank','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545505/temporales/blank_spui2b.png'},
  {'label': 'Bloques','template':'block','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545403/temporales/block_nq1tek.png'},
  {'label': 'Presentación','template':'presentation','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545403/temporales/presentation_uven0s.png'},
  {'label': 'Galería','template':'gallery','url_image':'https://res.cloudinary.com/deueufyac/image/upload/v1646545505/temporales/gallery_wsdga2.png'},
  ];
  
  constructor(private modalCtrl: ModalController,
  private router: Router,
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onTemplateClick(template) {
	  this.closeModal();
	  if(template.label === 'Libre') {
		  this.redirectTo(`/super-admin/map-editor/fair/`);
	  }
	  else {
		  this.redirectTo(`/super-admin/map-site-editor/fair/template/${template.template}`);
	  }
	  
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }
  
}


