import { Component, ElementRef, Inject, ViewChild, AfterViewInit, OnInit, AfterContentInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { DOCUMENT} from '@angular/common';
import { AgendasService } from './../../api/agendas.service';
import { FairsService } from './../../api/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersService } from '../../api/users.service';
import { environment, SERVER_URL } from '../../../environments/environment';


@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.page.html',
  styleUrls: ['./meeting.page.scss'],
})
export class MeetingPage implements OnInit {
  
  link = null;
  url = SERVER_URL;
  errors = null;
  aliasName = '';
  
  //@ViewChild('canvasMeeting', { static: true }) canvas: ElementRef;
  @ViewChild('videoMeeting', { static: true }) videoElement: ElementRef;
  fair: any;
  fullScreen = false;
  intro = null;
  scene: any;
  width = null;
  height = null;
  startPlay = false;
  agenda = null;
  flagOnInit = false;
  user: any = null;
  
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private fairsService: FairsService,
    private agendasService: AgendasService,
    private route: ActivatedRoute,
    private router: Router,
    private loading: LoadingService,
    private dom:DomSanitizer,
    private usersService: UsersService) {
        this.listenForFullScreenEvents();
  }

  ngOnInit() {
    const _self = this;    
    this.flagOnInit = true;
    const agendaId = this.route.snapshot.paramMap.get('meetingId');
    
    this.usersService.getUser()
    .then((userActive)=>{
        if(userActive) {
          this.user = userActive;
          this.aliasName = this.user.name + ' ' + this.user.last_name;
        }
    
        this.fairsService.getCurrentFair()
        .then( fair => {
          this.fair = fair;

            this.agendasService.get(agendaId)
            .then( (agenda)=>{
               this.agenda = agenda;
               this.intro = agenda.resources.video !== null;
               this.scene = agenda.resources;
               
               this.scene = {
                 "url_image":"https://res.cloudinary.com/dfxkgtknu/image/upload/v1611542378/feria1/auditorio1-background_Easy-Resize.com_m1sazv.jpg",
                 "container": {"w":1238, "h": 628},
                 "banners":[{
                 
                 }]};
                
                _self.onLoadingDismiss();
                const mbSkip = this.fairsService.getPavilionIntro('meeting_'+agendaId);
                
                //if(this.resources.video && !mbSkip) {
                //    const videoEl = <HTMLMediaElement>  this.videoElement.nativeElement;
                //    videoEl.autoplay = true;
                //    videoEl.muted = true;
                //    
                //    videoEl.onended = function() {
                //        _self.intro = false;
                //        _self.fairsService.setPavilionIntro('meeting_'+agendaId);
                //        videoEl.style.height = '0px';
                //    };
                //}
                //else {
                    this.intro = false;
                //}
                
                this.onResize();
            });      
          

        },error => {
          this.errors = error;    
        });
    });
    
    const div = document.querySelector<HTMLElement>('.div-container');
    div.addEventListener('scroll', this.logScrolling);
  }

  onLoadingDismiss() {
    this.loading.dismiss();
  }
  
  onToogleFullScreen() {
    window.dispatchEvent(new CustomEvent( this.fullScreen ?  'map:fullscreenOff' : 'map:fullscreenIn'));    
  }
 
  @HostListener('window:resize', ['$event'])
  onResize() {
        const videoElem = <HTMLMediaElement>document.getElementById('videoMeeting_'+this.agenda.id);
        
       // if(videoElem==1    ) {
       //     const container = this.canvas.nativeElement;
       //     const heightFull = container.clientHeight;
       //     let width = heightFull * this.resources._defaultWidth / this.resources._defaultHeight;
       //     let height = heightFull;
       //     if(width<container.clientWidth) {
       //       let widthFull = container.clientWidth;
       //       height = widthFull * this.resources._defaultHeight / this.resources._defaultWidth;
       //       width = widthFull;
       //     }
       //     this.width = width;
       //     this.height = height;
       // 
       //     videoElem.style.width = width + 'px';
       //       videoElem.style.height = height + 'px';
       // }
       
     const main = document.querySelector<HTMLElement>('ion-router-outlet');
     const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
     main.style.top = top + 'px';
     
     const tabsmenu = document.querySelector<HTMLElement>('.tabs-menu');
     tabsmenu.style.bottom = top + 'px';
     
     const left = (main.offsetWidth - 406) / 2;
     tabsmenu.style.left = left + 'px';
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
  
  onViewerMeeting() {
      const fair_id = this.fair.id;
      const meeting_id = this.agenda.id;
      const speaker_id = this.route.snapshot.paramMap.get('speaker_id') ? '/' + this.route.snapshot.paramMap.get('speaker_id') : 'false';
      const aliasName = this.aliasName;
      
      if(this.agenda.audience_config === '2') {
        this.usersService.getUser().then((userDataSession:any)=>{
            if(userDataSession!=null) {
                const email = userDataSession.email;
                this.agendasService.generateVideoToken(fair_id, meeting_id, userDataSession)
                .then( response => {
                  const token = response.data;                  
                  const url = `${this.url}/viewerZoom/meetings/${fair_id}/${meeting_id}/${aliasName}/${email}/${token}`;                  
                  this.link = this.dom.bypassSecurityTrustResourceUrl(url);
                  //window.open(url, '_blank').focus();
				  const windowReference = window.open();
				  windowReference.location.href = url;
                },error => {
                   this.errors = error;
                });
            }
            else { 
               this.errors = `Esta conferencia es privada, ingresa con tu usuario para acceder a ella`;
            }            
        });
      }
      else {
          this.usersService.getUser().then((userDataSession:any)=>{
            if(userDataSession!=null) {
               const email = userDataSession.email;
               const url = `${this.url}/viewerZoom/meetings/${fair_id}/${meeting_id}/${aliasName}/${email}`;
               this.link = this.dom.bypassSecurityTrustResourceUrl(url);
			   const windowReference = window.open();
			   //windowReference.location = url;
			   windowReference.location.href = url;

               //window.open(url, '_blank').focus();
            }
            else {
               const url = `${this.url}/viewerZoom/meetings/${fair_id}/${meeting_id}`;
               this.link = this.dom.bypassSecurityTrustResourceUrl(url);
               //window.open(url, '_blank').focus();
			   const windowReference = window.open();
			   windowReference.location.href = url;
            }
          });
      }
  } 
  
  logScrolling(e) {
      
      let target = e.target;
      
      const top = document.querySelector<HTMLElement>('ion-toolbar').offsetHeight;
      const sceneEl = document.querySelector<HTMLElement>('.scene');
      //sceneEl.style.top += top;
      
      const scrollLeft = document.querySelector<HTMLElement>('.div-container').scrollLeft;
      const scrollTop = document.querySelector<HTMLElement>('.div-container').scrollTop;
      const oldScrollX = Number(document.querySelector<HTMLElement>('.div-container').getAttribute('scroll-x'));
      const oldScrollY = Number(document.querySelector<HTMLElement>('.div-container').getAttribute('scroll-y'));
      const deltaX: number = scrollLeft - oldScrollX;
      const deltaY: number = scrollTop - oldScrollY;
      
      document.querySelectorAll<HTMLElement>('.scene').forEach((scene:HTMLElement)=>{
          scene.style.left = ( scene.offsetLeft - deltaX ) + 'px';  
          scene.style.top  = ( scene.offsetTop - deltaY ) + 'px';
      });
      
      document.querySelectorAll<HTMLElement>('.meetingFill').forEach((obj:HTMLElement)=>{
          obj.style.left = ( obj.offsetLeft - deltaX ) + 'px';  
          obj.style.top  = ( obj.offsetTop - deltaY ) + 'px';
      });
      
      document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-x',scrollLeft.toString());
      document.querySelector<HTMLElement>('.div-container').setAttribute('scroll-y',oldScrollY.toString());
      
      
      switch (target.id) {
        case 'btnScrollLeft':
            console.log('logScrolling  - btnScrollLeft');  
          break;
        case 'btnScrollTop':
          console.log('logScrolling - btnScrollTop');
        break;
      } 
  }
  
  ngOnDestroy(): void {
    //this.three.onDestroy();
  }
}
