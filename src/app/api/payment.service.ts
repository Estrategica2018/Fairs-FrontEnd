import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processData } from '../providers/process-data';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  url = '';
  refresTime = null;
  fair = null;
  fairName: string;
  
  constructor(private http: HttpClient) { }

  getPaymentUser(data) {
    return new Promise((resolve, reject) => {
        this.http.post(`/api/payment/fair`,data)
        .pipe(
          timeout(30000),
          catchError(e => {
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