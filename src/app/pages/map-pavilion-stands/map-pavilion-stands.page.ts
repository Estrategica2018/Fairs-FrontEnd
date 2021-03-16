import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { PavilionsService } from './../../api/pavilions.service';
import { ThreePavilionStandsService } from './../../providers/threejs/three.pavilion-stands.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-pavilion-stands',
  templateUrl: './map-pavilion-stands.page.html',
  styleUrls: ['./map-pavilion-stands.page.scss'],
})
export class MapPavilionStandsPage implements AfterViewInit {
    
  @ViewChild('canvasPavilionStand', { static: true }) canvas: ElementRef;
  showStandsMap = {};
  fullScreen = false;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private confData: ConferenceData,
    private platform: Platform,
    private pavilionsService: PavilionsService,
    private three: ThreePavilionStandsService,
    private route: ActivatedRoute,
    private router: Router) {
        
        this.listenForFullScreenEvents();
  }

  ngAfterViewInit() {
    
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
	const sceneId = this.route.snapshot.paramMap.get('sceneId');
	
    this.pavilionsService.get(pavilionId).then((pavilion)=>{
        if(pavilion && pavilion.resources && pavilion.resources.scenes && pavilion.resources.scenes.length > 0) {
		   
		   let scene = pavilion.resources.scenes[Number(sceneId)-1];
           this.three.initialize(this.canvas.nativeElement, scene, this);
        }
    });
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
  
  listenForFullScreenEvents() {
    window.addEventListener('map:fullscreenOff', (e:any) => {
      setTimeout(() => {
        this.fullScreen = false;
        this.three.onWindowResize(this.fullScreen);
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e:any) => {
      setTimeout(() => {
        this.fullScreen = true;
        this.three.onWindowResize(this.fullScreen);
      }, 300);
    });
  }
  
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
    
  }
}
