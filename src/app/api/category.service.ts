import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { processData } from '../providers/process-data';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = '';
  refresTime = null;
  fair = null;
  fairName: string;

  constructor(private http: HttpClient) { }

  list(type, fair): any {
    return new Promise((resolve, reject) => {
        this.http.get(`${SERVER_URL}/api/category/to_list/${fair.id}/${type}`)
        .pipe(
          timeout(60000),
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
        this.http.post(`${SERVER_URL}/api/category/create/`,category)
        .pipe(
          timeout(60000),
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
  createSubCategory(subCategory) {
    return new Promise((resolve, reject) => {
      this.http.post(`${SERVER_URL}/api/subcategory/create/`, subCategory)
        .pipe(
          timeout(60000),
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
  updateCategory(category) {
      return new Promise((resolve, reject) => {
        this.http.post(`${SERVER_URL}/api/category/update/`, category)
        .pipe(
          timeout(60000),
          catchError((e: any) => {
            console.log(e);
            if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio de editar categoría: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio de editar categorías`);
            }
          })
        )
        .subscribe(( data: any ) => {
            if (data.success) {
              resolve(data);

            } else {
              reject(JSON.stringify(data));
            }
        },error => {
            reject(error)
        });
      });
  }
  getCategory( categoryId: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(`${SERVER_URL}/api/category/get/${categoryId}`)
        .pipe(
          timeout(60000),
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
            //reject(JSON.stringify(data));
            throw new Error(`Consultando el servicio de categorías ` + JSON.stringify(data));
          }
        },error => {
          reject(error)
        });
    });
  }
}
