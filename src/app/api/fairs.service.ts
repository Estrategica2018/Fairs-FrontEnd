import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FairsService {

  url = '';
  refresTime = null;
  fair = null;
  fairName: string;
  
  constructor(private http: HttpClient) { }

  list(): any {
    
    return new Promise((resolve, reject) => {
        this.http.get(`/api/fair/to_list`)
       .pipe(
          timeout(30000),
          catchError(e => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Error consultando el servicio de feria: ${e.status} - ${e.statusText}`);    
            }
            else {
              throw new Error(`Error consultando el servicio de feria`);    
            }
          })
        )
        .subscribe((data : any )=> {
            resolve(data);
        },error => reject(error));
    });
  }
  
  setCurrentFair(): any {
    
    if(this.fair === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
        this.fairName = "FeriaGanadera2021";
        return new Promise((resolve, reject) => {
            this.list()
             .then((data) => {
                if(data && data.success == 201 && data.data )
                for(let fair of data.data ) {
                    if(fair.name  === this.fairName) {
                      this.refresTime = moment();
                      this.fair = fair;
                      for(let pavilion of this.fair.pavilions) {
                          if(pavilion.resources && typeof pavilion.resources == 'string') {
                            pavilion.resources = JSON.parse(pavilion.resources );
                          }
                      }
                      resolve(fair);
                      return;
                    }
                }
                throw new Error(`No se encontraron datos para la feria: ${this.fairName}`);
              })
            .catch(error => {
                reject(error)
             });
        });
    }
    else {
        return new Promise((resolve, reject) => resolve(this.fair));
    }
  }
  
}
