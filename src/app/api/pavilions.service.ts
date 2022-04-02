import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { FairsService } from '../api/fairs.service';
import { processData, processDataToString } from '../providers/process-data';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PavilionsService {

  url = '';
  refresTime = null;
  pavilions = null;
  fair = null;

  constructor(
    private http: HttpClient,
    private fairsService: FairsService
  ) { }

  list(): Promise<any> {
    if(this.pavilions === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
        
        return new Promise((resolve, reject) => {
            
            this.fairsService.getCurrentFair().
              then( fair => {
                this.fair = fair;
                this.http.get(`${SERVER_URL}/api/pavilion/find_by_fair/?fair_id=${fair.id}`)
                .pipe(
                  timeout(60000),
                  catchError((e: any) => {
                    console.log(e);
                    if(e.status && e.statusText) {
                      throw new Error(`Ejecutando el servicio para consulta de pabellones: ${e.status} - ${e.statusText}`);    
                    }
                    else {
                      throw new Error(`Ejecutando el servicio de consulta de pabellones`);
                    }
                  })
                )
                .subscribe((data : any )=> {
                    this.refresTime = moment();
                    this.pavilions = processData(data.data);
                    resolve({pavilions: this.pavilions, fair:this.fair});
                },error => {
                    reject(error)
                });
              },error => reject(error));
        })
    }
    else {
        return new Promise((resolve, reject) => resolve({pavilions: this.pavilions, fair:this.fair}));
    }
  }
  
  get(pavilionId: string): any {
    return new Promise((resolve, reject) => {
        this.list()
         .then((data) => {
            for(let pavilion of data.pavilions ) {
                if(Number(pavilion.id)  === Number(pavilionId)) {
                  resolve({pavilion: pavilion, fair:data.fair});
                  return;
                }
            }
            reject(`No se encontraron datos para el pabellón: ${pavilionId}`);
          })
        .catch(error => {
            reject(error)
         });    
    });
  }
  
  refreshCurrentPavilion() {
      this.pavilions = null;
  }
   
}
