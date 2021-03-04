import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { MeetingsService } from './../../api/meetings.service';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';
import { LoadingService } from './../../providers/loading.service';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  defaultHref = '';
  errors: string = null;

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
	private meetings: MeetingsService,
	private datepipe: DatePipe,
	private router: Router,
	private loading: LoadingService,
  ) { }

  ionViewWillEnter() {
	
	const sessionId = this.route.snapshot.paramMap.get('sessionId');
	this.loading.present({message:'Cargando...'});
	this.meetings.get(sessionId)
	 .then((meeting) => {
		this.loading.dismiss();
		this.errors = null;
		const strDay = this.datepipe.transform(new Date(meeting.start_at), 'EEEE, MMMM d, y');
		const startHour = this.datepipe.transform(new Date(meeting.start_at), 'hh:mm a');
		const endHour = this.datepipe.transform(new Date(meeting.start_at + meeting.duration * 60000), 'hh:mm a');
		const location = meeting.room ? meeting.room.name : '';
		
		this.session = Object.assign({
		  "strDay": strDay,
		  "timeStart": startHour,
		  "timeEnd": endHour,
		  "location": location
		},meeting);
		
	})
    .catch(error => {
	   this.loading.dismiss();
	   this.errors = error;
	});
	
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }

  goToMeeting(meetingId: string) {
    this.router.navigate(['/app/tabs/meeting/' + meetingId]);
  }
  
  sessionClick(meetingId: string) {
    
  }
  
  toggleFavorite() {
    if (this.userProvider.hasFavorite(this.session.name)) {
      this.userProvider.removeFavorite(this.session.name);
      this.isFavorite = false;
    } else {
      this.userProvider.addFavorite(this.session.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }
}
