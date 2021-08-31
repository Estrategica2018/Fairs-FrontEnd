import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processData, processDataToString } from '../providers/process-data';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  url = '';
  pavilions = {};
  
  constructor(
    private http: HttpClient
  ) { }

  get(fairId: string, pavilionId: string, standId: string, productId: string): any {
      return new Promise((resolve, reject) => {
            this.http.get(`/api/product/find_by/?fair_id=${fairId}&pavilion_id=${pavilionId}&stand_id=${standId}&product_id=${productId}`)
                .pipe(
                  timeout(30000),
                  catchError(e => {
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
