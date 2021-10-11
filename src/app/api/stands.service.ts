import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { PavilionsService } from './pavilions.service';
import { processData, processDataToString } from '../providers/process-data';

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
            this.http.get(`/api/products/find_by/?fair_id=${fairId}&pavilion_id=${pavilionId}&stand_id=${standId}&product_id=${productId}`)
                .pipe(
                  timeout(30000),
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
  
}
