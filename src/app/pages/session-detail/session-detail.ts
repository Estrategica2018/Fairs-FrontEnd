import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { AgendasService } from './../../api/agendas.service';
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
  defaultHref = '';
  errors: string = null;
  speaker: any;
  

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private agendasService: AgendasService,
    private datepipe: DatePipe,
    private router: Router,
    private loading: LoadingService,
  ) { }

  ionViewWillEnter() {
    
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    this.loading.present({message:'Cargando...'});
    this.agendasService.get(sessionId)
     .then((agenda) => {
        this.loading.dismiss();
        this.errors = null;
        const strDay = this.datepipe.transform(new Date(agenda.start_at), 'EEEE, MMMM d, y');
        const startHour = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
        const endHour = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
        const location = agenda.room ? agenda.room.name : '';
        
        this.session = Object.assign({
          "strDay": strDay,
          "timeStart": startHour,
          "timeEnd": endHour,
          "location": location
        },agenda);
        
    })
    .catch(error => {
       this.loading.dismiss();
       this.errors = error;
    });
    
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }

  goToMeeting(agendaId: string) {
    this.router.navigate(['/app/tabs/meeting/' + agendaId]);
  }
  
}
