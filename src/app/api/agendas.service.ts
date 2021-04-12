import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  
  updateSpeakers(fairId, meeting_id: string, data): any {
    return new Promise((resolve, reject) => {
        this.http.post(`/api/speakers/meetings?fair_id=${fairId}&meeting_id=${meeting_id}`, data)
		.pipe(
		  timeout(30000),
		  catchError(e => {
			console.log(e);
			if(e.status && e.statusText) {
			  throw new Error(`Error consultando el servicio para actualizar conferencistas: ${e.status} - ${e.statusText}`);    
			}
			else {
			  throw new Error(`Error consultando el servicio para actualizar conferencistas`);    
			}
		  })
		)
		.subscribe((data : any )=> {
			if(data.success) {
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
  
}
