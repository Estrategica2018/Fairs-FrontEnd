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
export class AdminProductPricesService {

  url = '';
  pavilions = {};
  
  constructor(
    private http: HttpClient
  ) { }

  createPrice(dataProduct): Promise<any> {

        return new Promise((resolve, reject) => {            
            
            this.http.post(`/api/product-price/create`, processDataToString(dataProduct))
            .pipe(
              timeout(30000),
              catchError(e => {
                if(e.status && e.statusText) {
                  const statusText = e.statusText + (e.error ? e.error.message : '');
                  throw new Error(`Consultando el servicio para crear el precio del producto: ${e.status} - ${statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para crear el producto`);    
                }
              })
            )
            .subscribe((data : any )=> {
                if(data.success) {
                  resolve(processData(data.data));
                }
                else {
                    reject(JSON.stringify(data));
                }
            },error => {
                reject(error)
            });
        });
  }
  
  updatePrice(productPrice: any): any {
    return new Promise((resolve, reject) => {

            this.http.post(`/api/product-price/update/${productPrice.id}`,processDataToString(productPrice))
            .pipe(
              timeout(30000),
              catchError(e => {
                if(e.status && e.statusText) {
                  throw new Error(`Ejecutando el servicio para modificar el precio del producto: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Ejecutando el servicio para modificar el precio del producto`);
                }
              })
            )
            .subscribe((data : any )=> {
                if(data.success) {
                  resolve(processData(data.data));
                }
                else {
                    reject(JSON.stringify(data));
                }
            },error => {
                reject(error)
            });
        });
  }
  
  deletePrice(productPrice: any): any {
    return new Promise((resolve, reject) => {

            this.http.post(`/api/product-price/delete/${productPrice.id}`, productPrice)
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para borrar el precio del producto: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para borrar local comercial`);    
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
