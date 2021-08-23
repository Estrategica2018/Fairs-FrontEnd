import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, ModalController, ToastController, Config } from '@ionic/angular';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { AgendasService } from './../../api/agendas.service';
import { FairsService } from './../../api/fairs.service';
import { LoadingService } from './../../providers/loading.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common'
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { UsersService } from './../../api/users.service';
import { WompiPaymentLayoutPage } from '../wompi-payment-layout/wompi-payment-layout.page';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss']
})
export class SchedulePage implements OnInit {
  
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;
  modal: any;
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
  fair: any;
  showPaymentFair: boolean = false;
  userPaidAllfair: boolean = false;
  loaded = 0;

  constructor(
    private alertCtrl: AlertController,
    private loading: LoadingService,
    private modalCtrl: ModalController,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private toastCtrl: ToastController,
    private config: Config,
    private agendasService: AgendasService,
    private datepipe: DatePipe,
    private fairsService: FairsService,
    private usersService: UsersService
  ) { 
    
  }

  ngOnInit() {
  }
  
  ngDoCheck(){
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
///     console.log(document.querySelector<HTMLElement>('ion-router-outlet'));
  }
  
  ionViewWillEnter () {

    this.ios = this.config.get('mode') === 'ios';
    
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.loading.present({message:'Cargando...'});
    this.fairsService.getCurrentFair().
      then( fair => {
        this.fair = fair;
        if(this.fair.price > 0) {
          this.usersService.getUser().then(userDataSession=> {
            if(userDataSession){
                  this.usersService.getPaymentUser({type:"Fair",id:this.fair.id},userDataSession).
                  then( (payment:any) => {
                      if(payment.success) {
                        this.userPaidAllfair = true;
                        this.showPaymentFair = false;
                     } else {
                         this.showPaymentFair = true;
                     }
                     this.onFinishLoad();
                  },error => {
                     this.errors = `${error}`;
                     this.onFinishLoad();
                  });
            }
            else {
                this.showPaymentFair = true;
                this.onFinishLoad();
            }
            
         });
        }
        else {
          this.onFinishLoad();
        }

        this.agendasService.list()
        .then((data) => {
            this.dataInitMeetings = data;
            this.transformSchedule();
            this.onFinishLoad();
         }, error => {
            console.log(error);
            this.errors = `Consultando el servicio para agenda [${error}]`;
            this.onFinishLoad();
         });
      },error => {
         this.errors = `Consultando el servicio para agenda [${error}]`;
         this.onFinishLoad();
      });
  }
  
  onFinishLoad(){
      this.loaded ++;
      if(this.loaded >=2) {
         this.loading.dismiss();
      }
  }
  
  
  transformSchedule() {
  
        this.groups = [];
        this.categories = [];
        let filterCount = 0;
        let showCount = 0;
        
        for (let agenda of this.dataInitMeetings) {
            agenda.hide  = false;
            const day = this.datepipe.transform(new Date( agenda.start_at ), 'yyyy-MM-dd');
            const strDay = this.datepipe.transform(new Date(agenda.start_at), 'EEEE, MMMM d, y');
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
            const startHour = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
            const endHour = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
            const location = agenda.room ? agenda.room.name : '';
            
            let categoryTemp = null; 
            for(let category of this.categories) {
                if(category.id === agenda.category.id) {
                    categoryTemp = agenda.category;
                }
            }
            if(!categoryTemp && agenda.category) {
                agenda.category.isChecked = true;
                this.categories.push(agenda.category);
            }
            
            if(this.categoriesFilter)
            for(let filter of this.categoriesFilter) {
                if(filter.isChecked && filter.id === agenda.category.id) {
                    agenda.hide = false; 
                    break;
                } else {
                    agenda.hide = true;
                }
            }
            
            if(this.queryText.length > 0) {
                function Normalize(text) { return text.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"") };
                if(Normalize(JSON.stringify(agenda)).indexOf(Normalize(this.queryText)) === -1) {
                    agenda.hide = true;
                }
            }
            
            if(agenda.hide) { filterCount ++; }
            else { showCount ++; }
            
            groupTemp.sessions.push(
                Object.assign({
                  "name": agenda.title,
                  "timeStart": startHour,
                  "timeEnd": endHour,
                  "location": location,
                }, agenda));
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
  

  async openTemplateFair() {

    this.modal = await this.modalCtrl.create({
      component: WompiPaymentLayoutPage,
      componentProps: {
          'objPrice': this.fair,
          'type': 'Fair',
          'container': this
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  } 
  
  ngOnDestroy(): void {
     if(this.modal) {
       this.modal.dismiss();
     }
  }
  
  async openTemplateAgenda(session) {

    this.modal = await this.modalCtrl.create({
      component: WompiPaymentLayoutPage,
      componentProps: {
          'objPrice': session,
          'type': 'Agenda'
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if(data) {
    }
  } 
  
}