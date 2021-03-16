import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { PavilionsService } from './pavilions.service';

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
         .then((pavilion) => {
            for(let stand of pavilion.stands) {
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
  
}
