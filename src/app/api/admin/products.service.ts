import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processDataToString } from '../../providers/process-data';
import { processData } from '../../providers/process-data';
import { UsersService } from '../users.service';

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {

  url = '';
  pavilions = {};
  
  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  create(dataProduct): Promise<any> {

    return new Promise((resolve, reject) => {            
            
		this.usersService.getUser().then((userDataSession: any)=>{
			const httpOptions = {
			  headers: new HttpHeaders({
				  'Authorization':  'Bearer ' + userDataSession.token
			  })
			};
			this.http.post(`/api/product/create`, processDataToString(dataProduct),httpOptions)
			.pipe(
			  timeout(30000),
			  catchError(e => {
				if(e.status && e.statusText) {
				  const statusText = e.statusText + (e.error ? e.error.message : '');
				  throw new Error(`Consultando el servicio para crear el producto: ${e.status} - ${statusText}`);    
				}
				else {
				  throw new Error(`Consultando el servicio para crear el producto`);    
				}
			  })
			)
			.subscribe((data : any )=> {
				if(data.success) {
				  resolve(processData(data.data));
				}
				else {
					reject(JSON.stringify(data));
				}
			},error => {
				reject(error)
			});
		});
	});
  }
  
  update(product: any): any {
    return new Promise((resolve, reject) => {
		this.usersService.getUser().then((userDataSession: any)=>{
			const httpOptions = {
			  headers: new HttpHeaders({
				  'Authorization':  'Bearer ' + userDataSession.token
			  })
			};
            this.http.post(`/api/product/update/${product.id}`,processDataToString(product),httpOptions)
            .pipe(
              timeout(30000),
              catchError(e => {
                if(e.status && e.statusText) {
                  throw new Error(`Ejecutando el servicio para modificar el producto: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Ejecutando el servicio para modificar el producto comercial`);
                }
              })
            )
            .subscribe((data : any )=> {
                if(data.success) {
                  resolve(processData(data.data));
                }
                else {
                    reject(JSON.stringify(data));
                }
            },error => {
                reject(error)
            });
        });
    });
  }
  
  delete(product: any): any {
    return new Promise((resolve, reject) => {
		this.usersService.getUser().then((userDataSession: any)=>{
			const httpOptions = {
			  headers: new HttpHeaders({
				  'Authorization':  'Bearer ' + userDataSession.token
			  })
			};
			
            this.http.post(`/api/product/delete/${product.id}`, product,httpOptions)
            .pipe(
              timeout(30000),
              catchError(e => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para borrar el producto: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para borrar el producto`);    
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
    });
  }
}
