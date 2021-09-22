import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { FairsService } from '../api/fairs.service';
import { processData } from '../providers/process-data';

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
            
            this.fairsService.getCurrentFair().
              then( fair => {
                this.http.get(`/api/agenda/list?fair_id=${fair.id}`)
                .pipe(
                  timeout(30000),
                  catchError(e => {
                    console.log(e);
                    if(e.status && e.statusText) {
                      throw new Error(`Consultando el servicio de agenda: ${e.status} - ${e.statusText}`);    
                    }
                    else {
                      throw new Error(`Consultando el servicio de agenda`);    
                    }
                  })
                )
                .subscribe((data : any )=> {
                    this.refresTime = moment();
                    this.agendas = processData(data.data);
                    for(let agenda of this.agendas) {
                      agenda.start_at  *= 1000;
                    }
                    resolve(this.agendas);
                },error => {
                    reject(error)
                });
              },error => {
                    reject(error)
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
  
  generateVideoToken(fair_id : string, meeting_id: string, userDataSession: any): any {
    return new Promise((resolve, reject) => {
        
      const httpOptions = {
        headers: new HttpHeaders({
         'Authorization':  'Bearer ' + userDataSession.token
          })
       };
  
       this.http.get(`/api/meeting/generate-video-token/${fair_id}/${meeting_id}`,httpOptions)
        .pipe(
          timeout(30000),
          catchError(e => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio para generar acceso a conferencia : ${e.status} - ${e.statusText}`);    
            }
            else {
              throw new Error(`Consultando el servicio para generar acceso a conferencia`);
            }
          })
        )
        .subscribe((data : any )=> {
            if(data.success == 201) {
               resolve(data);
            }
            else {
                reject(JSON.stringify(data));
            }
        },error => {
            reject(error)
        });   
    });
  }

  refreshCurrentAgenda(): any {
    this.agendas = null;
  }
  
}
