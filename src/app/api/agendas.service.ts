import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { FairsService } from '../api/fairs.service';
import { processData } from '../providers/process-data';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendasService {


  url = '';
  refresTime = null;
  agendas = null;

  constructor(
    private http: HttpClient,
    private fairsService: FairsService
  ) { }

  list(fairAdminMode): Promise<any> {

    return new Promise((resolve, reject) => {
      if (fairAdminMode || this.agendas === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
        this.fairsService.getCurrentFair().
          then(fair => {
            let url = `${SERVER_URL}/api/agenda/list?fair_id=${fair.id}`;
            url += fairAdminMode ? `&zoom_auth=1` : '';
            this.http.get(url)
              .pipe(
                timeout(60000),
                catchError((e: any) => {
                  console.log(e);
                  if (e.status && e.statusText) {
                    throw new Error(`Consultando el servicio de agenda: ${e.status} - ${e.statusText}`);
                  }
                  else {
                    throw new Error(`Consultando el servicio de agenda`);
                  }
                })
              )
              .subscribe((data: any) => {
                this.refresTime = moment();
                this.agendas = processData(data.data);
                for (let agenda of this.agendas) {
                  agenda.start_at *= 1000;
                }
                resolve(this.agendas);
              }, error => {
                reject(error)
              });
          }, error => {
            reject(error)
          });
      }
      else {
        resolve(this.agendas);
      }
    });
  }

  get(agendaId: string, fairAdminMode: boolean): any {
    return new Promise((resolve, reject) => {
      this.list(fairAdminMode)
        .then((data) => {
          for (let agenda of data) {
            if (Number(agenda.id) === Number(agendaId)) {
              resolve(agenda);
              return;
            }
          }
          reject(`No se encontraron datos para la agenda: ${agendaId}`);
        })
        .catch(error => {
          reject(error)
        });
    });
  }

  getByCategory(categoryId): any {
    return new Promise((resolve, reject) => {
      this.list(false)
        .then((data) => {
          let agendaList = [];
          for (let agenda of data) {
            if (categoryId == null || categoryId == 'all' || Number(agenda.category.id) === Number(categoryId)) {
              agendaList.push(agenda);
            }
          }
          if (agendaList.length == 0) {
            reject(`No se encontraron datos para la categoría: ${categoryId}`);
          }
          else {
            resolve(agendaList);
          }
        })
        .catch(error => {
          reject(error)
        });
    });
  }

  generateMeetingToken(fair_id: string, meeting_id: string, userDataSession: any): any {
    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + userDataSession.token
        })
      };

      this.http.get(`${SERVER_URL}/api/meeting/generate-meeting-token/${fair_id}/${meeting_id}`, httpOptions)
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            console.log(e);
            if (e.status && e.statusText) {
              throw new Error(`Consultando el servicio para generar acceso a conferencia : ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio para generar acceso a conferencia`);
            }
          })
        )
        .subscribe((data: any) => {
          if (data.success == 201) {
            resolve(data);
          }
          else {
            reject(JSON.stringify(data));
          }
        }, error => {
          reject(error)
        });
    });
  }

  refreshCurrentAgenda(): any {
    this.agendas = null;
  }

  availableList(agenda, userDataSession): Promise<any> {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + userDataSession.token
        })
      };

      this.fairsService.getCurrentFair().
        then(fair => {
          let url = `${SERVER_URL}/api/agenda/available/list/${fair.id}`;
          if (agenda) {
            url = `${SERVER_URL}/api/agenda/available/list/${fair.id}/${agenda.id}`;
          }
          this.http.get(url, httpOptions)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                console.log(e);
                if (e.status && e.statusText) {
                  throw new Error(`Consultando el servicio de agenda: ${e.status} - ${e.statusText}`);
                }
                else {
                  throw new Error(`Consultando el servicio de agenda`);
                }
              })
            )
            .subscribe((data: any) => {
              let agendas = processData(data.data);
              for (let agenda of agendas) {
                agenda.start_at *= 1000;
              }
              resolve(agendas);
            }, error => {
              reject(error)
            });
        }, error => {
          reject(error)
        });
    });
  }

  availableListMemories(agendaId, userDataSession): Promise<any> {

    return new Promise((resolve, reject) => {

      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + userDataSession.token
        })
      };

      this.fairsService.getCurrentFair().
        then(fair => {
          let url = `${SERVER_URL}/api/agenda/available/list-memories/${fair.id}/${agendaId}`;
          this.http.get(url, httpOptions)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                console.log(e);
                if (e.status && e.statusText) {
                  throw new Error(`Consultando el servicio de agenda: ${e.status} - ${e.statusText}`);
                }
                else {
                  throw new Error(`Consultando el servicio de agenda`);
                }
              })
            )
            .subscribe((data: any) => {
              let agendas = processData(data.data);
              resolve(agendas);
            }, error => {
              reject(error)
            });
        }, error => {
          reject(error)
        });
    });
  }

  register(fair: any, agenda: any, userDataSession: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + userDataSession.token
      })
    };

    let url = `${SERVER_URL}/api/agenda/register/${fair.id}/${agenda.id}`;
    return this.http.get(url, httpOptions)
      .pipe(
        timeout(60000),
        catchError((e: any) => {
          console.log(e);
          if (e.status && e.statusText) {
            throw new Error(`Consultando el servicio de agenda: ${e.status} - ${e.statusText}`);
          }
          else {
            throw new Error(`Consultando el servicio de agenda`);
          }
        })
      );
  }

  live(): Promise<any> {

    return new Promise((resolve, reject) => {

      this.fairsService.getCurrentFair().
        then(fair => {
          let url = `${SERVER_URL}/api/agenda/live?fair_id=${fair.id}`;

          this.http.get(url)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                console.log(e);
                if (e.status && e.statusText) {
                  throw new Error(`Consultando el servicio de agenda: ${e.status} - ${e.statusText}`);
                }
                else {
                  throw new Error(`Consultando el servicio de agenda`);
                }
              })
            )
            .subscribe((data: any) => {
              resolve(data);
            }, error => {
              reject(error)
            });
        }, error => {
          reject(error)
        });
    });
  }

  saveResgisterUrl(fair, agenda_id,userDataSession): Promise<any> {

    return new Promise((resolve, reject) => {

      let url = `${SERVER_URL}/api/viewerZoom/saveResgister/${fair.id}/${agenda_id}`;

      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + userDataSession.token
        })
      };

      this.http.get(url,httpOptions)
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            console.log(e);
            if (e.status && e.statusText) {
              throw new Error(`Consultando el servicio para registrar agenda: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio para registrar agenda`);
            }
          })
        )
        .subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error)
        });
    });
  }

}
