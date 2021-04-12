import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { PavilionsService } from './../../api/pavilions.service';
import { ThreePavilionStandsService } from './../../providers/threejs/three.pavilion-stands.service';
import { ThreePavilionService } from './../../providers/threejs/three.pavilion.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';

@Component({
  selector: 'app-map-pavilion-stands',
  templateUrl: './map-pavilion-stands.page.html',
  styleUrls: ['./map-pavilion-stands.page.scss'],
})
export class MapPavilionStandsPage implements AfterViewInit {
    
  @ViewChild('canvasPavilionStand', { static: true }) canvas: ElementRef;
  
  fullScreen = false;
  intro = null;
  resources = null;
  width = null;
  height = null;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private confData: ConferenceData,
    private platform: Platform,
    private pavilionsService: PavilionsService,
    private threeStand: ThreePavilionStandsService,
	private three: ThreePavilionService,
    private route: ActivatedRoute,
    private router: Router,
	private loading: LoadingService) {
        
  }

  ngAfterViewInit() {
    const videoElem = document.getElementById('video');
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
	const sceneId = this.route.snapshot.paramMap.get('sceneId');
	const _self = this;
	
	this.loading.present({message:'Cargando...'});
	
    this.pavilionsService.get(pavilionId).then((pavilion)=>{
        if(pavilion && pavilion.resources && pavilion.resources.scenes && pavilion.resources.scenes.length > 0) {
		   let scene = pavilion.resources.scenes[Number(sceneId)-1];
		   this.resources = scene.resources;
		   const container = _self.canvas.nativeElement;
			this.resources._defaultWidth = 1092;
			this.resources._defaultHeight = 607;
			
			//pavilion.resources.banners=[];
			let _defaultWidth = this.resources._defaultWidth;
			let _defaultHeight = this.resources._defaultHeight;
			
			_self.intro = pavilion.resources.video !== null;
			
			const heightFull = container.clientHeight;
			let width = heightFull * _defaultWidth / _defaultHeight;
			let height = heightFull;
			if(width<container.clientWidth) {
			
			  let widthFull = container.clientWidth;
			  height = widthFull * _defaultHeight / _defaultWidth;
			  width = widthFull;
			}
			this.width = width;
			this.height = height;	
			if(videoElem) {
			  videoElem.style.width = width + 'px';
			  videoElem.style.height = height + 'px';
			}
		
		  	_self.three.initialize(container, scene, _self);
			
			if(this.resources.video) {
			  document.getElementById('video').addEventListener('ended',function myHandler(e) {
				_self.intro = false;
				videoElem.style.height = '0px';
			  },false);
			}
			else {
				_self.intro = false;
			}
			 
           
        }
    });
  }
  
  onLoadingDismiss() {
    this.loading.dismiss();
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ?  'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
  
  onRouterLink(tab: string) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigateByUrl(tab);
    
  }
}
