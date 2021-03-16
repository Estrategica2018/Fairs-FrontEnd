import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { PavilionsService } from './../../../api/pavilions.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pavilion',
  templateUrl: './pavilion.page.html',
  styleUrls: ['./pavilion.page.scss'],
})
export class PavilionPage implements OnInit {

  pavilion: any;
  errors: string = null;
  
  constructor(
    private pavilionsService: PavilionsService,
    private route: ActivatedRoute,
    private loading: LoadingService
    ) { }

  ngOnInit() {
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    this.loading.present({message:'Cargando...'});
    this.pavilionsService.get(pavilionId)
     .then((pavilion) => {
        this.loading.dismiss();
        this.errors = null;
        this.pavilion = pavilion;
    })
    .catch(error => {
       this.loading.dismiss();
       this.errors = error;
    });
  }

}
