import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { FairsService } from '../api/fairs.service';

@Injectable({
  providedIn: 'root'
})
export class AgendasService {

  url = '';
  refresTime = null;
  agendas = null;

  constructor(
    private http: HttpClient,
    private fairsService: FairsService
  ) { }

  list(): Promise<any> {
    if(this.agendas === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
        
        return new Promise((resolve, reject) => {
            
            this.fairsService.setCurrentFair().
              then( fair => {
                this.http.get(`/api/agenda?fair_id=${fair.id}`)
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
                    this.agendas = data.data;
                    for(let agenda of this.agendas) {
                      agenda.start_at  *= 1000;
                      agenda.category = {"id":"2","name":"bolsos","color":"#ac282b"};
                      if(agenda.resources && typeof agenda.resources === 'string') {
                        agenda.resources = JSON.parse(agenda.resources);
                      }
                      if(agenda.invited_speakers)
                      for (let invited_speaker of agenda.invited_speakers) {
                        if(invited_speaker.speaker) {
                            if(invited_speaker.speaker.resources && typeof invited_speaker.speaker.resources === 'string') {
                              invited_speaker.speaker.resources = JSON.parse(invited_speaker.speaker.resources);
                            }
                        }
                      }
                    }
                    resolve(this.agendas);
                },error => {
                    reject(error)
                });
              });
        })
    }
    else {
        return new Promise((resolve, reject) => resolve(this.agendas));
    }
  }
  
  get(agendaId: string): any {
    return new Promise((resolve, reject) => {
        this.list()
         .then((data) => {
            for(let agenda of data ) {
                if(Number(agenda.id)  === Number(agendaId)) {
                  resolve(agenda);
                  return;
                }
            }
            reject(`No se encontraron datos para la agenda: ${agendaId}`);
          })
        .catch(error => {
            reject(error)
         });    
    });
  }
  
}
