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
export class AdminFairsService {

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  
  allList(): Promise<any> {

    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{ 
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };

            this.http.get(`/api/fair/list_all`,httpOptions)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                console.log(e);
                if(e.status && e.statusText) {
                  const statusText = e.statusText + (e.error ? e.error.message : '');
                  throw new Error(`Consultando el servicio de agenda: ${e.status} - ${statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio de agenda`);    
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
    });
  }
    
  updateFair(fair: any): any {
    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
            const newFair = processDataToString(fair);
            this.http.post(`/api/fair/update/${fair.id}`,newFair,httpOptions)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                const msg = (e.error && e.error.message) ? e.error.message : e.status + ' - ' + e.statusText;
                throw new Error(`${msg}`);
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
    });
  }  

  deleteFair(fair: any): any {
	  
    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
            const newFair = processDataToString(fair);
            this.http.post(`/api/fair/delete/${fair.id}`,newFair,httpOptions)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                const msg = (e.error && e.error.message) ? e.error.message : e.status + ' - ' + e.statusText;
                throw new Error(`${msg}`);
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
    });
  }  
    
  createFair(newFair: any): any {
    return new Promise((resolve, reject) => {
        this.usersService.getUser().then((userDataSession: any)=>{
            const httpOptions = {
              headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
            
            this.http.post(`/api/fair/create/`,newFair,httpOptions)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                const msg = (e.error && e.error.message) ? e.error.message : e.status + ' - ' + e.statusText;
                throw new Error(`${msg}`);
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
