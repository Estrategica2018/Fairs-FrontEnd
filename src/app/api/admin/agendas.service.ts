import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processDataToString } from '../../providers/process-data';
import { processData } from '../../providers/process-data';

@Injectable({
  providedIn: 'root'
})
export class AdminAgendasService {

  constructor(
    private http: HttpClient
  ) { }

  create(agenda): Promise<any> {

        return new Promise((resolve, reject) => {

            this.http.post(`/api/meetings`,processDataToString(agenda))
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
				  const statusText = e.statusText + (e.error ? e.error.message : '');
                  throw new Error(`Consultando el servicio de agenda: ${e.status} - ${statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio de agenda`);    
                }
              })
            )
            .subscribe((data : any )=> {
                if(data.success) {
                  resolve(processData(data));
                }
                else {
                    reject(JSON.stringify(data));
                }
            },error => {
                reject(error)
            });
        });
  }
  
  update(agenda: any): any {
    return new Promise((resolve, reject) => {

            this.http.patch(`/api/meetings/${agenda.zoom_code}`,processDataToString(agenda))
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para modificar agenda: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para modificar agenda`);    
                }
              })
            )
            .subscribe((data : any )=> {
                if(data.success) {
                  resolve(processData(data));
                }
                else {
                    reject(JSON.stringify(data));
                }
            },error => {
                reject(error)
            });
        });
  }
  
  delete(agenda: any): any {
    return new Promise((resolve, reject) => {

            this.http.delete(`/api/meetings/${agenda.zoom_code}`)
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para modificar agenda: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para modificar agenda`);    
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
