import { Component, ElementRef, Inject, ViewChild, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { StandsService } from './../../api/stands.service';
//import { ThreeStandService } from './../../providers/threejs/three.stand.service';
import { ThreePavilionService } from './../../providers/threejs/three.pavilion.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';

@Component({
  selector: 'app-map-stand',
  templateUrl: './map-stand.page.html',
  styleUrls: ['./map-stand.page.scss'],
})
export class MapStandPage implements OnInit {
    
  @ViewChild('canvasStand', { static: true }) canvas: ElementRef;
  showStandsMap = {};
  fullScreen = false;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private platform: Platform,
    private standsService: StandsService,
 // private threeStand: ThreeStandService,
    private three: ThreePavilionService,
    private route: ActivatedRoute,
	private loading: LoadingService,
    private router: Router) {
        this.listenForFullScreenEvents();
    }

  ngOnInit() {
    
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    this.loading.present({message:'Cargando...'});
    this.standsService.get(pavilionId, standId).then((stand)=>{
		stand.resources._defaultWidth = 1002;
		stand.resources._defaultHeight = 607;
		let _self = this;
        setTimeout(function(){
            _self.three.initialize(_self.canvas.nativeElement, stand, _self);
            _self.onLoadingDismiss();
		}
		,100);
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
    this.router.navigateByUrl(tab);
  }

  listenForFullScreenEvents() {
    window.addEventListener('map:fullscreenOff', (e:any) => {
      setTimeout(() => {
        this.fullScreen = false;
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e:any) => {
      setTimeout(() => {
        this.fullScreen = true;
      }, 300);
    });
  }
    
  ngOnDestroy(): void {
    this.three.onDestroy();
  }
}
