import { Component, OnInit, Input } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { AgendasService } from '../../../api/agendas.service';


@Component({
  selector: 'app-audience-select',
  templateUrl: './audience-select.page.html',
  styleUrls: ['./audience-select.page.scss'],
})
export class AudienceSelectPage implements OnInit {

  @Input() audiences: any;
  @Input() invited_emails: any;
  @Input() meeting_id: any;
  @Input() fair_id: any;
  
  filterTerm: any;
  
  constructor(
    private modalCtrl: ModalController,
    private agendasService: AgendasService
  ) { }

  ngOnInit() {
	  this.audiences.forEach((audience, index, array)=>{
		  audience.checked = audience.check == 1;
	  });
  }

   
  onSave() {
	/*audienceEmails = this.audiences.filter((audience)=>{
		return audience.status;
	});*/
	
	this.modalCtrl.dismiss(this.audiences);
  }
  
  readSingleFile(e) {
    const file = e.target.files[0];
	const _self = this;
    if (!file) {
      return;
    }
    var reader = new FileReader();
	
	
    reader.onload = function(fre:any) {
      var contents = fre.target.result.split('\n');
	  
	  function validateEmail(email) {
	    var re = /\S+@\S+\.\S+/;
	    return re.test(email);
	  }
	  
	  contents.forEach((email)=>{
		if(validateEmail(email)) {
		   _self.audiences.push({check:1, checked:true, email: email});
		}
	  })
    };
    reader.readAsText(file);
  }

  displayContents(contents) {
    alert(contents);
  }
  
  onLoadInputClick() {
    let element: HTMLElement = document.querySelector('#uploadInput') as HTMLElement;
    element.click();
  }
}
 

