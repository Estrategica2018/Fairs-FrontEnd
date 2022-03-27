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
export class SpeakersService {

  url = '';
  refresTime = null;
  speakers = null;

  constructor(
    private http: HttpClient,
    private fairsService: FairsService
  ) { }

  list(): any {
    //if(this.speakers === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
    if (true) {
        return new Promise((resolve, reject) => {
            this.fairsService.getCurrentFair().
              then( fair => {
                    this.http.get(`/api/speakers/meetings?fair_id=${fair.id}`)
                   .pipe(
                      timeout(60000),
                      catchError((e: any) => {
                        if(e.status && e.statusText) {
                          throw new Error(`Consultando el servicio de conferencistas: ${e.status} - ${e.statusText}`);
                        }
                        else {
                          throw new Error(`Consultando el servicio de conferencistas`);
                        }
                      })
                    )
                    .subscribe( (data: any) => {
                        this.refresTime = moment();
                        this.speakers = data.data;
                        for(let i=0; i < this.speakers.length; i++ ) {
                            this.speakers[i] = processData(this.speakers[i]);
                        }
                        resolve(this.speakers);
                    },error => reject(error));
              },error => reject(error));
        })
    }
    else {
        return new Promise((resolve, reject) => resolve(this.speakers));
    }
  }

  get(speaker_id: string): any {
    return new Promise((resolve, reject) => {
        this.list()
         .then((data) => {
            for(let speaker of data ) {
                if(Number(speaker.id)  === Number(speaker_id)) {
                  resolve(speaker);
                }
            }
            reject(`No se encontraron datos para el conferencista: ${speaker_id}`);
          })
        .catch(error => {
            reject(error)
         });
    });
  }

}
