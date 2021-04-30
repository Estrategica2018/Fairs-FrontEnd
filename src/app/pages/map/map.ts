import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { FairsService } from './../../api/fairs.service';
import { ThreeFairService } from './../../providers/threejs/three.fair.service';
import { ThreePavilionService } from './../../providers/threejs/three.pavilion.service';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';

@Component({
  selector: 'page-map',
  //templateUrl: 'map.html',
  //styleUrls: ['./map.scss']
  templateUrl: '../map-pavilion/map-pavilion.page.html',
  styleUrls: ['../map-pavilion/map-pavilion.page.scss']
})
export class MapPage implements AfterViewInit {
    
  @ViewChild('canvasPavilion', { static: true }) canvas: ElementRef;
  pavilion = null;
  showStandsMap = {};
  fullScreen = false;
  resources: any;
  intro = false;
  errors = null;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private confData: ConferenceData,
    private platform: Platform,
    private fairsService: FairsService,
    private threeFair: ThreeFairService,
    private three: ThreePavilionService,
    private router: Router,
    private loading: LoadingService) {
        
  }
  
  ngAfterViewInit() {
    this.errors = null;
	
	this.loading.present({message:'Cargando...'});
    this.fairsService.getCurrentFair().then((fair)=>{
        let _self = this;
		console.log(fair);
        setTimeout(function(){
            _self.three.initialize(_self.canvas.nativeElement, fair, _self);
            _self.onLoadingDismiss();
        }
        ,100);
    }, error => {
        this.loading.dismiss();
        console.log(error);
		this.errors = `Consultando el servicio del mapa general de la feria`;
    });
  }

  onLoadingDismiss(){
    this.loading.dismiss();
  }

  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
    
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
  }
}
