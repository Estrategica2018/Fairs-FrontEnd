import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processDataToString } from '../../providers/process-data';
import { processData } from '../../providers/process-data';
import { UsersService } from '../users.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAgendasService {

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  create(agenda): Promise<any> {

        return new Promise((resolve, reject) => {
            this.usersService.getUser().then((userDataSession: any)=>{
                const httpOptions = {
                  headers: new HttpHeaders({
                      'Authorization':  'Bearer ' + userDataSession.token
                  })
                };
                this.http.post(`/api/meetings`,processDataToString(agenda),httpOptions)
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
        });
  }
  
  update(agenda: any): any {
    return new Promise((resolve, reject) => {
            this.usersService.getUser().then((userDataSession: any)=>{
                const httpOptions = {
                  headers: new HttpHeaders({
                      'Authorization':  'Bearer ' + userDataSession.token
                  })
                };
                this.http.patch(`/api/meetings/${agenda.zoom_code}`,processDataToString(agenda), httpOptions)
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
        });
  }
  
  delete(agenda: any): any {
    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
            this.http.delete(`/api/meetings/${agenda.zoom_code}`,httpOptions)
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
    });
  }

  getEmails(fairId, agendaId: string): any {
    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };

            this.http.get(`/api/agenda/getEmails/${fairId}/${agendaId}`,httpOptions)
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para retornar la lista de correos: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para retornar la lista de correos`);    
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
    });
  }  
  
  
  updateSpeakers(fairId, meeting_id: string, data): any {
    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };

            this.http.post(`/api/speakers/meetings?fair_id=${fairId}&meeting_id=${meeting_id}`, data, httpOptions)
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para actualizar conferencistas: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para actualizar conferencistas`);    
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
    });
  }
  
  updateAudience(fairId, meeting_id: string, data): any {
    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };

            this.http.post(`/api/audience/meetings?fair_id=${fairId}&meeting_id=${meeting_id}`, data, httpOptions)
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para actualizar lista de correo: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para actualizar lista de correo`);    
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
    });
  }

}
