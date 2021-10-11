import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { FairsService } from '../api/fairs.service';
import { processData } from '../providers/process-data';

@Injectable({
  providedIn: 'root'
})
export class MerchantsService {

  url = '';
  refresTime = null;
  merchants = null;
  
  constructor(
    private http: HttpClient,
    private fairsService: FairsService
  ) { }

  list(): any {
    if(this.merchants === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
        return new Promise((resolve, reject) => {
            this.fairsService.getCurrentFair().
              then( fair => {
                    this.http.get(`/api/merchant/to_list/${fair.id}`)
                   .pipe(
                      timeout(30000),
                      catchError((e: any) => {
                        if(e.status && e.statusText) {
                          throw new Error(`Ejecutando el servicio consulta de comercios: ${e.status} - ${e.statusText}`);    
                        }
                        else {
                          throw new Error(`Ejecutando el servicio consulta de comercios`);    
                        }
                      })
                    )
                    .subscribe( (data: any) => { 
                        this.refresTime = moment();
                        this.merchants = data.data;
                        for(let i=0; i < this.merchants.length; i++ ) {
                            this.merchants[i] = processData(this.merchants[i]);
                        }
                        resolve(this.merchants);
                    },error => reject(error));
              },error => reject(error));
        })
    }
    else {
        return new Promise((resolve, reject) => resolve(this.merchants));
    }
  }
  
  get(merchant_id: string): any {
    return new Promise((resolve, reject) => {
        this.list()
         .then((merchants) => {
            for(let merchant of merchants ) {
                if(Number(merchant.id)  === Number(merchant_id)) {
                  resolve(merchants);
                }
            }
            reject(`No se encontraron datos para el comercio: ${merchant_id}`);
          })
        .catch(error => {
            reject(error)
         });    
    });
  }
  
}
