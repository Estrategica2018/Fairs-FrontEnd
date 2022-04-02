import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { PavilionsService } from './pavilions.service';
import { processData, processDataToString } from '../providers/process-data';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StandsService {

  url = '';
  pavilions = {};

  constructor(
    private http: HttpClient,
    private pavilionsService: PavilionsService
  ) { }

  get(pavilionId: string, standId: string): any {
    return new Promise((resolve, reject) => {
        this.pavilionsService.get(pavilionId)
         .then((response) => {
            for(let stand of response.pavilion.stands) {
              if(Number(stand.id)  === Number(standId)) {
                resolve(stand);
                return;
              }
            }
            reject(`No se encontraron datos para el local comercial: ${standId}`);
          })
        .catch(error => {
            reject(error)
         });
    });
  }

  getProduct(fairId: string, pavilionId: string, standId: string, productId: string): any {
      return new Promise((resolve, reject) => {
            this.http.get(`${SERVER_URL}/api/products/find_by/?fair_id=${fairId}&pavilion_id=${pavilionId}&stand_id=${standId}&product_id=${productId}`)
                .pipe(
                  timeout(60000),
                  catchError((e: any) => {
                    console.log(e);
                    if(e.status && e.statusText) {
                      throw new Error(`Ejecutando el servicio para consulta de productos: ${e.status} - ${e.statusText}`);
                    }
                    else {
                      throw new Error(`Ejecutando el servicio de consulta de productos`);
                    }
                  })
                )
                .subscribe((data : any )=> {
                    const product = processData(data.data);
                    resolve(product);
                },error => {
                    reject(error)
                });
      });
  }

  sendMessage(messageData): Promise<any> {

    return new Promise((resolve, reject) => {

      this.http.post(`${SERVER_URL}/api/stand/contactsupport/notification`, messageData)
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            console.log(e);
            if ( e.status == 422) {
              const error = JSON.stringify(e.error);
              throw new Error(`Consultando el servicio para envío de mensajes: ${error}`);
            } else if ( e.status && e.statusText) {
              throw new Error(`Consultando el servicio para envío de mensajes: ${e.status} - ${e.statusText}`);
            } else {
              throw new Error(`Consultando el servicio para envío de mensajes`);
            }
          })
        )
        .subscribe((data : any ) => {
          if (data.success) {
            resolve(data);
          } else {
            reject(JSON.stringify(data));
          }
        },error => {
          reject(error)
        });
    });
  }
}
