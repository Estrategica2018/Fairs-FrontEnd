import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processData } from '../providers/process-data';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  url= SERVER_URL;
  refresTime = null;
  fair = null;
  fairName: string;
  
  constructor(private http: HttpClient) { }

  createNewReference( data ,userDataSession) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':  'Bearer ' + userDataSession.token
      })
    };
    return new Promise((resolve, reject) => {
        this.http.post(`/api/payment/generate`,data,httpOptions)
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio de pagos realizados: ${e.status} - ${e.statusText}`);    
            }
            else {
              throw new Error(`Consultando el servicio de pagos realizados`);
            }
          })
        )
        .subscribe((data : any )=> {
            resolve(data);
        },error => {
            reject(error)
        });   
    });
  }

  updateReference( data ,userDataSession) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':  'Bearer ' + userDataSession.token
      })
    };
    return new Promise((resolve, reject) => { 
        this.http.post(`/api/wompi/auth/${data.id}`,data,httpOptions)
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio de pagos realizados: ${e.status} - ${e.statusText}`);    
            }
            else {
              throw new Error(`Consultando el servicio de pagos realizados`);
            }
          })
        )
        .subscribe((data : any )=> {
            resolve(data);
        },error => {
            reject(error)
        });   
    });
  }

}
