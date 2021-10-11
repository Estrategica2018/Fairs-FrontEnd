import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { FairsService } from '../fairs.service';
import { processData, processDataToString } from '../../providers/process-data';
import { UsersService } from '../users.service';

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
    private fairsService: FairsService,
    private usersService: UsersService
  ) { }

  create(data: any): any {
    return new Promise((resolve, reject) => {        
      this.usersService.getUser().then((userDataSession: any)=>{
        const httpOptions = {
          headers: new HttpHeaders({
              'Authorization':  'Bearer ' + userDataSession.token
          })
        };
        this.http.post(`/api/pavilion/create2`, processDataToString(data),httpOptions)
        .pipe(
          timeout(30000),
          catchError((e: any) => {
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
    });
  }
  
  update(pavilion: any): any {
    return new Promise((resolve, reject) => {
      this.usersService.getUser().then((userDataSession: any)=>{
        const httpOptions = {
          headers: new HttpHeaders({
              'Authorization':  'Bearer ' + userDataSession.token
          })
        };

        this.http.post(`/api/pavilion/update/${pavilion.id}`, processDataToString(pavilion),httpOptions)
        .pipe(
          timeout(30000),
          catchError((e: any) => {
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
    });
  }
    
  delete(pavilion: any): any {
    return new Promise((resolve, reject) => {
      this.usersService.getUser().then((userDataSession: any)=>{
        const httpOptions = {
          headers: new HttpHeaders({
              'Authorization':  'Bearer ' + userDataSession.token
          })
        };
        this.http.post(`/api/pavilion/delete/${pavilion.id}`, {pavilion_id: pavilion.id},httpOptions)
        .pipe(
          timeout(30000),
          catchError((e: any) => {
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
    });
  }
}
