import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { processDataToString } from '../../providers/process-data';
import { processData } from '../../providers/process-data';
import { UsersService } from '../users.service';
import { environment, SERVER_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminMerchantsService {

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

      this.http.post(`${SERVER_URL}/api/merchant/create`, processDataToString(data),httpOptions)
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            if(e.status && e.statusText) {
              const statusText = e.statusText + (e.error ? e.error.message : '');
              throw new Error(`Consultando el servicio para crear comercio : ${e.status} - ${statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio para crear comercio`);
            }
          })
        )
        .subscribe(( dataResponse: any ) => {
          if (data.success) {
            resolve(processData(dataResponse.data));
          } else {
            data = processData(data);
            reject(JSON.stringify(dataResponse));
          }
        },error => {
          reject( error )
        });
      });
    });
  }
  get(data): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(`${SERVER_URL}/api/merchant/get_merchant`, processDataToString(data))
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            if (e.status && e.statusText) {
              const statusText = e.statusText + (e.error ? e.error.message : '');
              throw new Error(`Consultando el servicio para obtener comercio : ${e.status} - ${statusText}`);
            } else {
              throw new Error(`Consultando el servicio para obtener comercio`);
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
          reject(error)
        });
    });
  }
  update(data): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(`${SERVER_URL}/api/merchant/update`, processDataToString(data))
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            if (e.status && e.statusText) {
              const statusText = e.statusText + (e.error ? e.error.message : '');
              throw new Error(`Consultando el servicio para modificar comercio : ${e.status} - ${statusText}`);
            } else {
              throw new Error(`Consultando el servicio para modificar comercio`);
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
          reject(error)
        });
    });
  }


}
