import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  url = '';
  refresTime = null;
  meetings = null;

  constructor(private http: HttpClient) { }

  list(): Promise<any> {
	if(this.meetings === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
		return new Promise((resolve, reject) => {
			this.http.get(`/api/meetings`)
		   .pipe(
			  timeout(30000),
			  catchError(e => {
				console.log(e);
				if(e.status && e.statusText) {
				  throw new Error(`Error consultando el servicio de agenda: ${e.status} - ${e.statusText}`);	
				}
				else {
				  throw new Error(`Error consultando el servicio de agenda`);	
				}
			  })
			)
			.subscribe((data : any )=> {
				this.refresTime = moment();
				this.meetings = data.data.meetings;
				for(let meeting of this.meetings) {
				  meeting.start_at  *= 1000;
				  meeting.category = {"id":"2","name":"bolsos","color":"#ac282b"};
				  if(meeting.resources && typeof meeting.resources === 'string') {
					meeting.resources = JSON.parse(meeting.resources);
				  }
				  for (let speaker of meeting.speakers) {
					speaker.data_speaker = speaker.data_speaker[0];
					if(speaker.data_speaker.resources && typeof speaker.data_speaker.resources === 'string') {
					  speaker.data_speaker.resources = JSON.parse(speaker.data_speaker.resources);
					}
				    speaker.data_speaker.title = 'CO manager Cor S.A';
					console.log(speaker);
				  }
				}
				resolve(this.meetings);
			},error => reject(error));
		})
	}
	else {
		return new Promise((resolve, reject) => resolve(this.meetings));
	}
  }
  
  get(meetingId: string): any {
	return new Promise((resolve, reject) => {
		this.list()
		 .then((data) => {
			for(let meeting of data ) {
				if(Number(meeting.id)  === Number(meetingId)) {
				  resolve(meeting);
				  return;
				}
			}
			reject(`No se encontraron datos para la agenda: ${meetingId}`);
		  })
		.catch(error => {
			reject(error)
		 });	
	});
  }
  
}
