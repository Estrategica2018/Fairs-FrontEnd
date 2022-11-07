import { Component, HostListener, OnInit } from '@angular/core';
import { AgendasService } from 'src/app/api/agendas.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-form-mincultura-catalog',
  templateUrl: './form-mincultura-catalog.page.html',
  styleUrls: ['./form-mincultura-catalog.page.scss'],
})
export class FormMinculturaCatalogPage implements OnInit {

  scheduleList: any;
  clientHeight: any;
  largeScreen: any;
  agendaSelect: any;
  mediumScreen : any;
  smallScreen : any;

  constructor(private agendasService: AgendasService,
    private datepipe: DatePipe) { }

  ngOnInit() {

    setTimeout(() => {
      this.onResize(null);  
    }, 100);
  
    
    this.initializeFormsCatalogs();

    this.agendasService.list(null)
      .then((agendas) => {
      });

  }


  initializeFormsCatalogs() {

    this.scheduleList = [];
    let category = 'Talleres';
    category = 'all';

    this.agendasService.list(null)
      .then((agendas) => {
        if (agendas.length > 0) {
          agendas.forEach((agenda) => {
            if (category == 'all' || agenda.category.name == category) {
              this.scheduleList.push(agenda);
              let name;
              agenda._nameSpeakers = '';
              for (let speaker of agenda.invited_speakers) {
                name = speaker.speaker.user.name + ' ' + speaker.speaker.user.last_name;
                if (agenda._nameSpeakers != null && agenda._nameSpeakers.length > 0) {
                  agenda._nameSpeakers += ',';
                }
                agenda._nameSpeakers += name;
              }

              agenda.startTime = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
              agenda.endTime = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
            }

            setTimeout(() => {
              this.onResize(null);  
            }, 100);

            
          });
          //this.transformSchedule(banner);
        }

      })
      .catch(error => {
        console.log(error);
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.largeScreen = window.innerWidth >= 1308;
    this.mediumScreen = window.innerWidth >= 859 && window.innerWidth <= 1308;
    this.smallScreen = window.innerWidth <= 859;
  }

  changeSelect(agenda){

    let check: any = document.querySelector<HTMLElement>('#check-agenda-'+agenda.id);
    if(check.checked) {
      this.agendaSelect = agenda;

      let lista = document.querySelectorAll('.ckech-agenda');
      lista.forEach((checkAgenda: any)=>{
        checkAgenda.checked = false;
      });
      check.checked = true;
    }
    else {
      this.agendaSelect = false;
    }
    
  }
}
