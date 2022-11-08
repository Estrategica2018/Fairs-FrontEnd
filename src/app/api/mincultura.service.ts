import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MinculturaService {

  url = SERVER_URL;

  constructor(
    private http: HttpClient) {
  }

  getMinculturaUser(userDataSession: any, fair: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + userDataSession.token
      })
    };

    return this.http.get(`${SERVER_URL}/api/user/mincultura/${fair.id}`, httpOptions)
      .pipe(
        timeout(3000),
        catchError((e: any) => {
          if (e.status == 401) {
            throw new Error(`Usuario ya existe`);
          }
          else {
            if (e.status && e.statusText) {
              throw new Error(`Consultando el servicio para consultar usuario: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio para consultar usuario`);
            }
          }
        })
      )
  }

  registerMinculturaUser(userDataSession: any, fair: any, minculturaUser: any, agendaId: number): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + userDataSession.token
      })
    };

    let data = Object.assign(minculturaUser, {'agendaId': agendaId});
    return this.http.post(`${SERVER_URL}/api/user/mincultura/register/${fair.id}`, data, httpOptions)
      .pipe(
        timeout(3000),
        catchError((e: any) => {
          if (e.status == 401) {
            throw new Error(`Usuario ya existe`);
          }
          else {
            if (e.status && e.statusText) {
              throw new Error(`Consultando el servicio para actualizar usuario: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio para actualizar usuario`);
            }
          }
        })
      )
  }

}
