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

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private platform: Platform,
    private pavilionsService: PavilionsService,
    private three: ThreePavilionService,
    private route: ActivatedRoute,
    private router: Router) {
        
        this.listenForFullScreenEvents();
        
    }

  ngAfterViewInit() {
    
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    
    this.pavilionsService.get(pavilionId).then((pavilion)=>{
        this.three.initialize(this.canvas.nativeElement, pavilion, this);
    });
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
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ? 'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
  
  onRouterLink(tab: string) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigateByUrl(tab);
    
  }
  
}
