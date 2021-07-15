import { Component, OnInit } from '@angular/core';
import { FairsService } from '../../../api/fairs.service';
import { AgendasService } from './../../../api/agendas.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-fair',
  templateUrl: './fair.page.html',
  styleUrls: ['./fair.page.scss'],
})
export class FairPage implements OnInit {

  constructor(
    private fairsService: FairsService,
    private agendasService: AgendasService,
	private adminFairsService: AdminFairsService,
	private datepipe: DatePipe
  ) { 
  
  }
  
  fair: any;
  agendas: any;
  errors: string;
  editSave: any;
  showPrice = false;

  ngOnInit() {
      this.fairsService.getCurrentFair().
      then( fair => {
        this.fair = fair;
		this.showPrice = fair.price > 0;
		
		this.agendasService.list()
		.then((agendas) => {
			this.agendas = agendas;
			this.agendas.forEach((agenda)=>{
				agenda.startTime = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
                agenda.endTime = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
                agenda.location = agenda.room ? agenda.room.name : '';
			})
		 })
		 .catch(error => {
			console.log(error);
			this.errors = `Consultando el servicio para agenda`;
		 });
        
      }, errors => {
          
      });
  }
  
  onAddEscene() {
	  const main = document.querySelector<HTMLElement>('ion-router-outlet');
	  const scene = { 'url_image': 'https://dummyimage.com/1092x768/EFEFEF/000.png', 'banners': [], 'container':  { 'w': main.offsetWidth, 'h': main.offsetHeight },
					  'show': true,'menuIcon':'map-outline', 'title': 'Escena' };
	  this.fair.resources.push(scene);
  }
  
  ionChange() {
	this.editSave = true;
  }  
  
  updateFair() {
  if(!this.showPrice) {	
    this.fair.price = 0;
  }
  
   this.adminFairsService.update(this.fair).
      then( fair => {
        
      }, errors => {
          this.errors = `Consultando el servicio para modificar feria`;
      });	  
  }
  
  toogleShowPrice() { 
    this.showPrice = !this.showPrice;
    this.editSave = true;
  }

}
