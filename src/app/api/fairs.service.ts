import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processData } from '../providers/process-data';

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
  
  getCurrentFair(): any {
    
    if(this.fair === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
        return new Promise((resolve, reject) => {
            try {
                this.fairName = window.location.href.split('.')[0].replace('http://','').replace('https://','');
            } catch(error) {
                reject(`No se encontraron datos para la feria`);
            }
        
            this.list()
             .then((data) => {
                if(data && data.success == 201 && data.data )
                for(let fair of data.data ) {
                    if(fair.name.toUpperCase()=== this.fairName.toUpperCase()) {
                      this.refresTime = moment();
                      this.fair = processData(fair);
					  let pavilion=null;

					  for(let i=0;i<this.fair.pavilions.length; i++) {
						 pavilion = this.fair.pavilions[i];
					     pavilion.hasSceneStands = null;
						 if(pavilion.resources && pavilion.resources.scenes) {
						   for(let scene of pavilion.resources.scenes) {
							  if(scene.type == 'stands') {
								 pavilion.hasSceneStands = i + 1;
								 break;
							  }
						   }
						 }
					  }
                      resolve(this.fair);
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
