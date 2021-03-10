import { Component, OnInit } from '@angular/core';
import { FairsService } from '../../../api/fairs.service';

@Component({
  selector: 'app-fair',
  templateUrl: './fair.page.html',
  styleUrls: ['./fair.page.scss'],
})
export class FairPage implements OnInit {

  constructor(private fairsService: FairsService) { }
  fair: any;

  ngOnInit() {
	  this.fairsService.setCurrentFair().
      then( fair => {
		this.fair = fair;
		
	  }, errors => {
		  
	  });
  }

}
