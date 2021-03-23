import { Component, ElementRef, Inject, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { FairsService } from './../../api/fairs.service';
import { ThreeFairService } from './../../providers/threejs/three.fair.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements OnInit {
    
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  showStandsMap = {};
  fullScreen = false;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private confData: ConferenceData,
    private platform: Platform,
    private fairsService: FairsService,
    private three: ThreeFairService,
    private router: Router) {
        
        
  }
  
  ngOnInit() {
    this.fairsService.getCurrentFair().then((fair)=>{
        this.three.initialize(this.canvas.nativeElement, fair, this, 'map');
    });	  
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
