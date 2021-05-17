import { Component, ElementRef, Inject, ViewChild, AfterViewInit, OnInit, AfterContentInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { DOCUMENT} from '@angular/common';
import { AgendasService } from './../../api/agendas.service';
import { FairsService } from './../../api/fairs.service';
import { ThreePavilionService } from './../../providers/threejs/three.pavilion.service';
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
  
  @ViewChild('canvasMeeting', { static: true }) canvas: ElementRef;
  @ViewChild('videoMeeting', { static: true }) videoElement: ElementRef;
  fair: any;
  fullScreen = false;
  intro = null;
  resources: any;
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
    private three: ThreePavilionService,
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
		  this.user.aliasName = this.user.name + ' ' + this.user.last_name;
		}
	
		this.fairsService.getCurrentFair()
		.then( fair => {
		  this.fair = fair;

			this.agendasService.get(agendaId)
			.then( (agenda)=>{
			   this.agenda = agenda;
			   this.intro = agenda.resources.video !== null;
			   this.resources = agenda.resources;
			   
			   this.resources = {
				 "url_image":"/assets/icon/null-21_1_joxd4u.jpg",
				 "scene":{ 
				 "resources": {"_defaultWidth": 1300,
				 "_defaultHeight": 694,
				 "url_image":"https://res.cloudinary.com/dfxkgtknu/image/upload/v1611542378/feria1/auditorio1-background_Easy-Resize.com_m1sazv.jpg",
				 "banners":[{
				 "image_url":"assets/icon/play_video.png",
				 "rotation":{"_x":-0.07,"_y":-0.05999999999999932,"_z":0,"_order":"XYZ"},"scale":{"x":0.18999999999999861,"y":0.9900000000000004,"z":1},"position":{"x":-0.009999999999998977,"y":-0.4200000000000002,"z":0},
				 "callback": { "meeting_id": "1", "type": "meeting" }
				 }]}}};
				
				setTimeout(function(){
					_self.three.initialize(_self.canvas.nativeElement, _self.resources.scene, _self);
					_self.onLoadingDismiss();
				}
				,100);
			
				const mbSkip = this.fairsService.getPavilionIntro('meeting_'+agendaId);
				
				if(this.resources.video && !mbSkip) {
					const videoEl = <HTMLMediaElement>  this.videoElement.nativeElement;
					videoEl.autoplay = true;
					videoEl.muted = true;
					
					videoEl.onended = function() {
						_self.intro = false;
						_self.fairsService.setPavilionIntro('meeting_'+agendaId);
						videoEl.style.height = '0px';
					};
				}
				else {
					this.intro = false;
				}
			});	  
		  

		},error => {
		  this.errors = error;	
		});
		
		
	})
	
	
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
  
  onViewerMeeting() {
      //const url = 'http://127.0.0.1:9999/meeting.html?name=SW52aXRhZG8%3D&mn=81589051101&email=&pwd=QlZrTXZjNmtKQ3Bnbm05V0djdlRQQT09&role=0&lang=en-US&signature=dWRwd1A1Y1VSVHVwaEJsa3hmUFJhdy44MTU4OTA1MTEwMS4xNjE0MTIxODM0NTIwLjAubzlOdDVYZVg5NG1mRThFUTNuNWJnYXE4cWU4RzV0WENCUS93SnhQazNNdz0&china=0&apiKey=udpwP5cURTuphBlkxfPRaw';
      //const url = 'http://127.0.0.1:9999/meeting.html?name=bWlub21icmVkZXVzdWFyaW8%3D&mn=84386868717&email=ZGF2QGNvbS5jbw%3D%3D&pwd=aHp3S00yYWNrRDgzZ1ZWUEFJcmQ0UT09&role=1&lang=es-ES&signature=dWRwd1A1Y1VSVHVwaEJsa3hmUFJhdy44NDM4Njg2ODcxNy4xNjE4MjU4MDgxNTIxLjEuV1crRFk4Vmp3Y1VsYXJvVXBHdURDZVpGMS8vWUcyQWd3UjVnT2JCWm1Yaz0&china=0&apiKey=udpwP5cURTuphBlkxfPRaw';
	  //const url = this.url + '/viewerZoom/meetings?meeting_id=1&speaker_id=1';//?fair_id=1&meeting_id=1&speaker_id=1'
	  //const url = this.url + '/viewerZoom/meetings?meeting_id=1&speaker_id=1&fair_id=1';
	  const fair_id = this.fair.id;
	  const meeting_id = this.agenda.id;
	  const speaker_id = this.route.snapshot.paramMap.get('speaker_id') ? '/' + this.route.snapshot.paramMap.get('speaker_id') : 'false';
	  //const url = this.url + '/viewerZoom/meetings/'+fair_id+'/'+meeting_id+speaker_id;
	  const name = this.user ? this.user.aliasName : 'false';
	  
	  if(this.agenda.audience_config === '2') {
	    this.usersService.getUser().then(userDataSession=>{
			if(userDataSession) {
				this.agendasService.generateVideoToken(fair_id, meeting_id, userDataSession)
				.then( response => {
				  const token = response.data;
				  const url = `${this.url}/viewerZoom/meetings/${fair_id}/${meeting_id}/${name}/${speaker_id}/${token}`;
				  
				  this.link = this.dom.bypassSecurityTrustResourceUrl(url);
				  window.open(url, '_blank').focus();
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
		  const url = `${this.url}/viewerZoom/meetings/${fair_id}/${meeting_id}`;
		  this.link = this.dom.bypassSecurityTrustResourceUrl(url);
		  window.open(url, '_blank').focus();
	  }
  } 
  
  ngOnDestroy(): void {
    this.three.onDestroy();
  }
}
