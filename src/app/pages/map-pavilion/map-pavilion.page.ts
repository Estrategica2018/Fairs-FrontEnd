import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { PavilionsService } from './../../api/pavilions.service';
import { ThreePavilionService } from './../../providers/threejs/three.pavilion.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'page-map-pavilion',
  templateUrl: 'map-pavilion.page.html',
  styleUrls: ['./map-pavilion.page.scss']
})
export class MapPavilionPage implements AfterViewInit {
    
  @ViewChild('canvasPavilion', { static: true }) canvas: ElementRef;
  showStandsMap = {};
  fullScreen = false;
  intro = null;
  resources = null;
  width = null;
  height = null;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private platform: Platform,
    private pavilionsService: PavilionsService,
    private three: ThreePavilionService,
    private route: ActivatedRoute,
    private router: Router) {
        
    }

  ngAfterViewInit() {
	const videoElem = document.getElementById('video');
    const _self = this;
	
	const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
	
    this.pavilionsService.get(pavilionId)
	  .then((pavilion)=>{
		
		this.resources = pavilion.resources;
		
		const container = _self.canvas.nativeElement;
		pavilion.resources._defaultWidth = 1092;
		pavilion.resources._defaultHeight = 607;
		const ionContent = document.querySelector('#ionContent');
		
		//pavilion.resources.banners=[];
		let _defaultWidth = pavilion.resources._defaultWidth;
		let _defaultHeight = pavilion.resources._defaultHeight;
		
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
		
		_self.three.initialize(_self.canvas.nativeElement, pavilion, _self);
		
		if(this.resources.video) {
		  document.getElementById('video').addEventListener('ended',function myHandler(e) {
			_self.intro = false;
			videoElem.style.height = '0px';
		  },false);
		}
		else {
			_self.intro = false;
		}
		  
	});
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
