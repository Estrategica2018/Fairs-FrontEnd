import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FairService {

  url = '';
  refresTime = null;
  fair = null;

  constructor(private http: HttpClient) { }

  list(): any {
	this.fair = { id: 1 };
	if(this.fair === null || moment().isAfter(moment(this.refresTime).add(120, 'seconds'))) {
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
				this.refresTime = moment();
				this.fair = data.data.fair;
				resolve(this.fair);
			},error => reject(error));
		})
	}
	else {
		return new Promise((resolve, reject) => resolve(this.fair));
	}
  }
  
  get(fairName: string): any {
	return new Promise((resolve, reject) => {
		this.list()
		 .then((data) => {
			for(let fair of data ) {
				if(fair.name  === fairName) {
				  resolve(fair);
				  return;
				}
			}
			reject(`No se encontraron datos para la feria: ${fairName}`);
		  })
		.catch(error => {
			reject(error)
		 });	
	});
  }
  
}
