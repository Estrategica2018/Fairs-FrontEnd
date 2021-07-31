import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { FairsService } from '../fairs.service';
import { processData, processDataToString } from '../../providers/process-data';

@Injectable({
  providedIn: 'root'
})
export class AdminPavilionsService {

  url = '';
  refresTime = null;
  pavilions = null;
  fair = null;

  constructor(
    private http: HttpClient,
    private fairsService: FairsService
  ) { }

  create(data: any): any {
    return new Promise((resolve, reject) => {
        this.http.post(`/api/pavilion/create/`, processDataToString(data))
        .pipe(
          timeout(30000),
          catchError(e => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio para crear el pabellón: ${e.status} - ${e.statusText}`);    
            }
            else {
              throw new Error(`Consultando el servicio para crear el pabellón`);    
            }
          })    
        )
        .subscribe((response : any )=> {
            this.refresTime = moment();
            if(response.success == 201) {
              resolve(processData(response.data));
            }
            else {
                reject(JSON.stringify(response.data));
            }
        },error => {
            reject(error)
        });
        
        
    });
  }
  
  update(pavilionId: string, data: any): any {
    return new Promise((resolve, reject) => {
        this.http.post(`/api/pavilion/update/${pavilionId}`, processDataToString(data))
        .pipe(
          timeout(30000),
          catchError(e => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio para actualizar el pabellón: ${e.status} - ${e.statusText}`);    
            }
            else {
              throw new Error(`Consultando el servicio para actualizar el pabellón`);    
            }
          })
        )
        .subscribe((response : any )=> {
            this.refresTime = moment();
            if(response.success == 201) {
              resolve(processData(response.data));
            }
            else {
                reject(JSON.stringify(response.data));
            }
        },error => {
            reject(error)
        });
        
        
    });
  }
    
  delete(pavilion: any): any {
    return new Promise((resolve, reject) => {
        this.http.post(`/api/pavilion/delete/${pavilion.id}`, {pavilion_id: pavilion.id})
        .pipe(
          timeout(30000),
          catchError(e => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio para borrar el pabellón: ${e.status} - ${e.statusText}`);    
            }
            else {
              throw new Error(`Consultando el servicio para borrar el pabellón`);    
            }
          })
        )
        .subscribe((response : any )=> {
            this.refresTime = moment();
            if(response.success == 201) {
              resolve(processData(response.data));
            }
            else {
                reject(JSON.stringify(response.data));
            }
        },error => {
            reject(error)
        });
        
        
    });
  }
}
