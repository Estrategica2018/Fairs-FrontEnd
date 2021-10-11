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
export class CategoryService {

  url = '';
  refresTime = null;
  fair = null;
  fairName: string;
  
  constructor(private http: HttpClient) { }

  list(type,fair): any {
    return new Promise((resolve, reject) => {
        this.http.get(`/api/category/to_list/${fair.id}/${type}`)
        .pipe(
          timeout(30000),
          catchError((e: any) => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio de categorías: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio de categorías`);
            }
          })
        )
        .subscribe((data : any )=> {
            if(data.success) {
              resolve(processData(data));
              
            }
            else {
              reject(JSON.stringify(data));
            }
        },error => {
            reject(error)
        });
    });
  }
  
  createCategory(category){
    return new Promise((resolve, reject) => {
        this.http.post(`/api/category/create/`,category)
        .pipe(
          timeout(30000),
          catchError((e: any) => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio de categorías: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio de categorías`);
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
    
   updateCategory(category){
      return new Promise((resolve, reject) => {
        this.http.post(`/api/category/create/`,category)
        .pipe(
          timeout(30000),
          catchError((e: any) => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio de categorías: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio de categorías`);
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
