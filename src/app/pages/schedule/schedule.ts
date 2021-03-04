import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, ModalController, ToastController, Config } from '@ionic/angular';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { MeetingsService } from './../../api/meetings.service';
import { LoadingService } from './../../providers/loading.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common'
import { Injectable, Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
  providers: [MeetingsService]
})
export class SchedulePage implements OnInit {
  
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;
  
  categories: any = [];
  dataInitMeetings = null;
  categoriesFilter: any = null;
  textFilters: string;
  results: Observable<any>;
  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  shownSessions: any = [];
  groups: any = null;
  confDate: string;
  showSearchbar: boolean;
  locale: string;
  errors: string = null;

  constructor(
    private alertCtrl: AlertController,
    private loading: LoadingService,
    private modalCtrl: ModalController,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private toastCtrl: ToastController,
    private config: Config,
    private meetings: MeetingsService,
	private datepipe: DatePipe
  ) { 
    
  }

  ionViewWillEnter () {
	this.ios = this.config.get('mode') === 'ios';
	
	// Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

	this.loading.present({message:'Cargando...'});
	this.meetings.list()
    .then((data) => {
		this.loading.dismiss();
		this.dataInitMeetings = data;
		this.transformSchedule();
	 })
     .catch(error => {
		this.loading.dismiss();
		this.errors = `Consultando el servicio para agenda`;
	 });
  }
  
  ngOnInit() {
  
  }
  
  transformSchedule() {
  
		this.groups = [];
		this.categories = [];
		let filterCount = 0;
		let showCount = 0;
		
		for (let meeting of this.dataInitMeetings) {
		    meeting.hide  = false;
			const day = this.datepipe.transform(new Date( meeting.start_at ), 'yyyy-MM-dd');
			const strDay = this.datepipe.transform(new Date(meeting.start_at), 'EEEE, MMMM d, y');
			let groupTemp = null;
			for (let group of this.groups) {
				if(group.time === strDay) {
					groupTemp = group;
					break;
				}
			}
			if(!groupTemp) {
				groupTemp = {
					time: strDay,
					sessions: []
				};
				this.groups.push(groupTemp);
			}
			const startHour = this.datepipe.transform(new Date(meeting.start_at), 'hh:mm a');
			const endHour = this.datepipe.transform(new Date(meeting.start_at + meeting.duration * 60000), 'hh:mm a');
			const location = meeting.room ? meeting.room.name : '';
			
			let categoryTemp = null; 
			for(let category of this.categories) {
				if(category.id === meeting.category.id) {
					categoryTemp = meeting.category;
				}
			}
			if(!categoryTemp && meeting.category) {
				meeting.category.isChecked = true;
				this.categories.push(meeting.category);
			}
			
			if(this.categoriesFilter)
			for(let filter of this.categoriesFilter) {
				if(filter.isChecked && filter.id === meeting.category.id) {
					meeting.hide = false; 
					break;
				} else {
					meeting.hide = true;
				}
			}
			
			if(this.queryText.length > 0) {
				function Normalize(text) { return text.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"") };
				if(Normalize(JSON.stringify(meeting)).indexOf(Normalize(this.queryText)) === -1) {
					meeting.hide = true;
				}
			}
			
			if(meeting.hide) { filterCount ++; }
			else { showCount ++; }
			
			groupTemp.sessions.push(
				Object.assign({
				  "name": meeting.title,
				  "timeStart": startHour,
				  "timeEnd": endHour,
				  "location": location,
				}, meeting));
		}
		
		for(let group of this.groups) {
			const list = group.sessions.filter(c => !c.hide);
			group.hide = list.length === 0;
		}
		this.textFilters = "";
		if(filterCount > 0 ) {
		   if(showCount === 1)
		   this.textFilters = showCount + " elemento encontrado - "
	       if(showCount > 1)
		   this.textFilters = showCount + " elementos encontrados - "
	       if(filterCount === 1)
		   this.textFilters += (filterCount) + " elemento filtrado";
	       if(filterCount > 1)
		   this.textFilters += (filterCount) + " elementos filtrados";
		}
  }

  async presentFilter() {
	
	if(!this.categoriesFilter) this.categoriesFilter = this.categories;
	
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { categories: this.categoriesFilter }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
	  this.categoriesFilter = [];
      for(let dt of data) {
		this.categoriesFilter.push({
			id: dt.id,
			name: dt.name,
			color: dt.color,
			isChecked: dt.isChecked
		});
	  }
      this.transformSchedule();
    }
  } 
  
}