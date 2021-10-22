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
export class AdminSpeakersService {

  url = '';
  pavilions = {};

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  create(data): Promise<any> {

    return new Promise((resolve, reject) => {

       this.usersService.getUser().then((userDataSession: any)=>{
        const httpOptions = {
          headers: new HttpHeaders({
              'Authorization':  'Bearer ' + userDataSession.token
          })
      };

      this.http.post(`/api/speakers/create`, processDataToString(data),httpOptions)
        .pipe(
          timeout(30000),
          catchError(e => {
            if (e.status && e.statusText) {
              const statusText = e.statusText + (e.error ? e.error.message : '');
              throw new Error(`Consultando el servicio para crear conferencista : ${e.status} - ${statusText}`);
            } else {
              throw new Error(`Consultando el servicio para crear conferencista`);
            }
          })
        )
        .subscribe(( data: any ) => {
          if (data.success) {
            resolve(processData(data.data));
          } else {
            reject(JSON.stringify(data));
          }
        },error => {
          reject( error )
        });
      });
    });
  }

  update(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usersService.getUser().then((userDataSession: any) => {
        const httpOptions = {
          headers: new HttpHeaders({
            Authorization:  'Bearer ' + userDataSession.token
          })
        };
        this.http.post(`/api/speakers/update`, processDataToString(data), httpOptions)
          .pipe(
            timeout(30000),
            catchError(e => {
              if (e.status && e.statusText) {
                const statusText = e.statusText + (e.error ? e.error.message : '');
                throw new Error(`Consultando el servicio para actualizar conferencista : ${e.status} - ${statusText}`);
              } else {
                throw new Error(`Consultando el servicio para actualizar conferencista`);
              }
            })
          )
          .subscribe(( data : any ) => {
            if (data.success) {
              resolve(processData(data.data));
            } else {
              reject(JSON.stringify(data));
            }
          }, error => {
            reject( error );
          });
      });
    });
  }

  delete(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usersService.getUser().then((userDataSession: any) => {
        const httpOptions = {
          headers: new HttpHeaders({
            Authorization:  'Bearer ' + userDataSession.token
          })
        };
        this.http.post(`/api/speakers/delete`, processDataToString(data), httpOptions)
          .pipe(
            timeout(30000),
            catchError(e => {
              if (e.status && e.statusText) {
                const statusText = e.statusText + (e.error ? e.error.message : '');
                throw new Error(`Consultando el servicio para eliminar conferencista : ${e.status} - ${statusText}`);
              } else {
                throw new Error(`Consultando el servicio para eliminar conferencista`);
              }
            })
          )
          .subscribe(( data : any ) => {
            if (data.success) {
              resolve(processData(data.data));
            } else {
              reject(JSON.stringify(data));
            }
          }, error => {
            reject( error );
          });
      });
    });
  }
}
