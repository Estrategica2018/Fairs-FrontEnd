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
export class AdminProductPricesService {

  url = '';
  pavilions = {};
  
  constructor(
    private http: HttpClient,
	private usersService: UsersService
  ) { }

  createPrice(dataProduct): Promise<any> {

    return new Promise((resolve, reject) => {            
	  this.usersService.getUser().then((userDataSession: any)=>{
		const httpOptions = {
		  headers: new HttpHeaders({
			  'Authorization':  'Bearer ' + userDataSession.token
		  })
		};
		
		this.http.post(`/api/product-price/create`, processDataToString(dataProduct),httpOptions)
		.pipe(
		  timeout(30000),
		  catchError(e => {
			if(e.status && e.statusText) {
			  const statusText = e.statusText + (e.error ? e.error.message : '');
			  throw new Error(`Consultando el servicio para crear el precio del producto: ${e.status} - ${statusText}`);    
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
  
  updatePrice(productPrice: any): any {
    return new Promise((resolve, reject) => {
	  this.usersService.getUser().then((userDataSession: any)=>{
		const httpOptions = {
		  headers: new HttpHeaders({
			  'Authorization':  'Bearer ' + userDataSession.token
		  })
		};

		this.http.post(`/api/product-price/update/${productPrice.id}`,processDataToString(productPrice),httpOptions)
		.pipe(
		  timeout(30000),
		  catchError(e => {
			if(e.status && e.statusText) {
			  throw new Error(`Ejecutando el servicio para modificar el precio del producto: ${e.status} - ${e.statusText}`);    
			}
			else {
			  throw new Error(`Ejecutando el servicio para modificar el precio del producto`);
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
  
  deletePrice(productPrice: any): any {
    return new Promise((resolve, reject) => {
	  this.usersService.getUser().then((userDataSession: any)=>{
		const httpOptions = {
		  headers: new HttpHeaders({
			  'Authorization':  'Bearer ' + userDataSession.token
		  })
		};

		this.http.post(`/api/product-price/delete/${productPrice.id}`, productPrice,httpOptions)
		.pipe(
		  timeout(30000),
		  catchError(e => {
			console.log(e);
			if(e.status && e.statusText) {
			  throw new Error(`Consultando el servicio para borrar el precio del producto: ${e.status} - ${e.statusText}`);    
			}
			else {
			  throw new Error(`Consultando el servicio para borrar local comercial`);    
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
