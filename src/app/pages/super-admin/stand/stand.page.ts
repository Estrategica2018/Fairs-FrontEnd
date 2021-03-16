import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { StandsService } from './../../../api/stands.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stand',
  templateUrl: './stand.page.html',
  styleUrls: ['./stand.page.scss'],
})
export class StandPage implements OnInit {

  stand: any;
  errors: string = null;
  
  constructor(
    private standsService: StandsService,
    private route: ActivatedRoute,
    private loading: LoadingService
    ) { }

  ngOnInit() {
    const standId = this.route.snapshot.paramMap.get('standId');
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    this.loading.present({message:'Cargando...'});
    this.standsService.get(pavilionId,standId)
     .then((stand) => {
        this.loading.dismiss();
        this.errors = null;
        this.stand = stand;
    })
    .catch(error => {
       this.loading.dismiss();
       this.errors = error;
    });
  }

}
