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
export class PavilionsService {

  url = '';
  refresTime = null;
  pavilions = null;

  constructor(
    private http: HttpClient,
    private fairsService: FairsService
  ) { }

  list(): Promise<any> {
    if(this.pavilions === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
        
        return new Promise((resolve, reject) => {
            
            this.fairsService.getCurrentFair().
              then( fair => {
                this.http.get(`/api/pavilion/find_by_fair/?fair_id=${fair.id}`)
                .pipe(
                  timeout(30000),
                  catchError(e => {
                    console.log(e);
                    if(e.status && e.statusText) {
                      throw new Error(`Consultando el servicio de pabellones: ${e.status} - ${e.statusText}`);    
                    }
                    else {
                      throw new Error(`Consultando el servicio de pabellones`);
                    }
                  })
                )
                .subscribe((data : any )=> {
                    this.refresTime = moment();
                    this.pavilions = processData(data.data);
                    resolve(this.pavilions);
                },error => {
                    reject(error)
                });
              },error => reject(error));
        })
    }
    else {
        return new Promise((resolve, reject) => resolve(this.pavilions));
    }
  }
  
  get(pavilionId: string): any {
    return new Promise((resolve, reject) => {
        this.list()
         .then((data) => {
            for(let pavilion of data ) {
                if(Number(pavilion.id)  === Number(pavilionId)) {
                  resolve(pavilion);
                  return;
                }
            }
            reject(`No se encontraron datos para el pabellón: ${pavilionId}`);
          })
        .catch(error => {
            reject(error)
         });    
    });
  }

  update(pavilionId: string, data: any): any {
    return new Promise((resolve, reject) => {
        this.http.post(`/api/pavilion/update/${pavilionId}`, data)
		.pipe(
		  timeout(30000),
		  catchError(e => {
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
  }
    
}
