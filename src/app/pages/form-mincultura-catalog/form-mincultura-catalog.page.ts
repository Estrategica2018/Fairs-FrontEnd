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
              console.log(agenda);
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
    this.largeScreen = window.innerWidth >= 485;
    var child = document.querySelector<HTMLElement>('app-form-mincultura-catalog');
    var parent = <HTMLElement>child.parentNode;
    //this.clientHeight = parent.offsetHeight - child.offsetHeight;
    //this.clientHeight = child.scrollHeight - child.clientHeight;
    this.clientHeight = window.outerHeight;

    let range = document.querySelector<HTMLElement>('ion-content');
    console.log(range.getBoundingClientRect());
    console.log(range.scrollHeight);


    console.log(parent.offsetHeight);
    console.log(child.offsetHeight);
    console.log(child.scrollHeight);

    
  }
}
