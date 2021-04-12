import { Component, ElementRef, Inject, ViewChild, AfterViewInit, OnInit, AfterContentInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { DOCUMENT} from '@angular/common';
import { PavilionsService } from './../../api/pavilions.service';
import { FairsService } from './../../api/fairs.service';
import { ThreePavilionService } from './../../providers/threejs/three.pavilion.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';


@Component({
  selector: 'page-map-pavilion',
  templateUrl: 'map-pavilion.page.html',
  styleUrls: ['./map-pavilion.page.scss']
})
export class MapPavilionPage implements OnInit {
    
  @ViewChild('canvasPavilion', { static: true }) canvas: ElementRef;
  @ViewChild('videoPavilion', { static: true }) videoElement: ElementRef;
  
  fullScreen = false;
  intro = null;
  resources: any;
  width = null;
  height = null;
  startPlay = false;
  pavilion = null;
  flagOnInit = false;
  
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private fairsService: FairsService,
    private pavilionsService: PavilionsService,
    private three: ThreePavilionService,
    private route: ActivatedRoute,
    private router: Router,
    private loading: LoadingService) {
        this.listenForFullScreenEvents();
  }
  
  async ngOnInit() {
      
    const _self = this;    
    this.flagOnInit = true;
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
   // this.loading.present({message:'Cargando...'});
    
    await this.pavilionsService.get(pavilionId)
    .then( async (pavilion)=>{
       this.pavilion = pavilion;
       this.intro = pavilion.resources.video !== null;
       this.resources = pavilion.resources;
        
        // get a reference to a <video> element
        setTimeout(function(){
            _self.three.initialize(_self.canvas.nativeElement, pavilion, _self);
            //_self.onLoadingDismiss();
        }
        ,100);
    
        const mbSkipPavilion = this.fairsService.getPavilionIntro('pavilion_'+pavilionId);
        
        if(this.resources.video && !mbSkipPavilion) {
            //const videoEl = <HTMLMediaElement> document.querySelector('#videoPavilion_'+pavilion.id);
            //const videoEl = <HTMLMediaElement> document.createElement('video');
            const videoEl = <HTMLMediaElement>  this.videoElement.nativeElement;
            //videoEl.className = 'video';
            //videoEl.id = 'videoPavilion_'+pavilion.id;
            //videoEl.src = this.resources.video;
            videoEl.autoplay = true;
            videoEl.muted = true;
            //this.onResize();
            
            videoEl.onended = function() {
                _self.intro = false;
                _self.fairsService.setPavilionIntro('pavilion_'+pavilionId);
                videoEl.style.height = '0px';
            };
            //document.getElementsByClassName('PavilionContainer_'+pavilion.id)[0].appendChild(videoEl);
        }
        else {
            this.intro = false;
        }
    });
  }
  
  
//const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
//  //this.loading.present({message:'Cargando...'});
//  const _self = this;
//
//  await this.pavilionsService.get(pavilionId)
//  .then( async (pavilion)=>{
//     //this.pavilion = pavilion;
//   //this.intro = pavilion.resources.video !== null;
//     //this.resources = pavilion.resources;
//    // get a reference to a <video> element
//    
//    //if(this.resources.video) {
//    //    //const videoEl = <HTMLMediaElement> document.querySelector('.video');
//    //    const videoEl = <HTMLMediaElement> document.querySelector('#videoPavilion_'+this.pavilion.id);
//    //    videoEl.className = 'video';
//    //    //videoEl.id = 'videoPavilion_'+pavilion.id;
//    //    //videoEl.src = this.resources.video;
//    //    videoEl.autoplay = true;
//    //    videoEl.muted = true;
//    //    //this.onResize();
//    //    
//    //    videoEl.onended = function() {
//    //        _self.intro = false;
//    //        videoEl.style.height = '0px';
//    //    };
//    //    //document.getElementsByClassName('PavilionContainer_'+pavilion.id)[0].appendChild(videoEl);
//    //}
//});
//}
  
  onLoadingDismiss() {
    this.loading.dismiss();
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ?  'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
 
  @HostListener('window:resize', ['$event'])
  onResize() {
          const videoElem = <HTMLMediaElement>document.getElementById('videoPavilion_'+this.pavilion.id);
        
        if(videoElem) {
            const container = this.canvas.nativeElement;
            const heightFull = container.clientHeight;
            let width = heightFull * this.resources._defaultWidth / this.resources._defaultHeight;
            let height = heightFull;
            if(width<container.clientWidth) {
              let widthFull = container.clientWidth;
              height = widthFull * this.resources._defaultHeight / this.resources._defaultWidth;
              width = widthFull;
            }
            this.width = width;
            this.height = height;
        
            videoElem.style.width = width + 'px';
              videoElem.style.height = height + 'px';
        }
  }
  
  listenForFullScreenEvents() {
    window.addEventListener('map:fullscreenOff', (e:any) => {
        setTimeout(() => {
          this.onResize();
      }, 300);
    });
    window.addEventListener('map:fullscreenIn', (e:any) => {
        setTimeout(() => {
          this.onResize();
      }, 300);
    });
  }
  
  onRouterLink(tab) {
    this.fullScreen = false;
    window.dispatchEvent(new CustomEvent('map:fullscreenOff'));
    this.router.navigate([tab]);
  }
  
}
