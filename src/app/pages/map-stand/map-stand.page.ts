
import { Component, ElementRef, Inject, ViewChild, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { StandsService } from './../../api/stands.service';
import { ThreeStandService } from './../../providers/threejs/three.stand.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


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
    private three: ThreeStandService,
    private route: ActivatedRoute,
    private router: Router) {
        
        this.listenForFullScreenEvents();
        
    }

  ngOnInit() {
    
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    
    this.standsService.get(pavilionId, standId).then((stand)=>{
        this.three.initialize(this.canvas.nativeElement, stand, this);
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
  
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigateByUrl(tab);
  }
  
}
