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
export class AdminSpeakersService {

  url = '';
  pavilions = {};

  constructor(
    private http: HttpClient
  ) { }

  create(data): Promise<any> {

    return new Promise((resolve, reject) => {

      this.http.post(`/api/speaker/create`, processDataToString(data))
        .pipe(
          timeout(30000),
          catchError(e => {
            if (e.status && e.statusText) {
              const statusText = e.statusText + (e.error ? e.error.message : '');
              throw new Error(`Consultando el servicio para crear conferencista : ${e.status} - ${statusText}`);
            } else {
              throw new Error(`Consultando el servicio para crear conferencista`);
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
          reject( error )
        });
    });
  }



}
