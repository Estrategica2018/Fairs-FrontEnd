import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { processData } from '../providers/process-data';
import { UsersService } from '../api/users.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCarts {

  url = '';
  refresTime = null;
  agendas = null;

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  list(fair: any): Promise<any> {
    
        return new Promise((resolve, reject) => {
            this.usersService.getUser().then((userDataSession: any)=>{ 
              const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };     
            this.http.get(`/api/shopping-cart/list?fair_id=${fair.id}`,httpOptions)
            .pipe(
              timeout(30000),
              catchError((e: any) => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio de carrito de compras: ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio de carrito de compras`);    
                }
              })
            )
            .subscribe((data : any )=> {
                this.refresTime = moment();
                this.agendas = processData(data.data);
                for(let agenda of this.agendas) {
                  agenda.start_at  *= 1000;
                }
                resolve(this.agendas);
            },error => {
                reject(error)
            });
          },error => {
                reject(error)
          });
        });
  }
   
  
  addShoppingCart(fair: any, product: any, productPrice: any, amount: number): any {
    
    return new Promise((resolve, reject) => {
        
        this.usersService.getUser().then((userDataSession: any)=>{ 
            const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
           
		   const data = {
			   "fair_id": fair.id,
			   "product_id": product.id,
			   "product_price_id": productPrice.id, 
			   "amount": amount  
		   };
		   
           this.http.post(`/api/store/shopping-cart/${fair.id}`,data,httpOptions)
            .pipe(
              timeout(30000),
              catchError((e: any) => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para agregar al carrito de compras : ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para agregar al carrito de compras`);
                }
              })
            )
            .subscribe((data : any )=> {
                if(data.success == 201) {
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
 
 
  removeShoppingCart(fair: any, shoppingCart: any): any {
    
    return new Promise((resolve, reject) => {
        
        this.usersService.getUser().then((userDataSession: any)=>{ 
            const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
  
           this.http.delete(`/api/add/shopping-cart/${fair.id}/${shoppingCart.id}`,httpOptions)
            .pipe(
              timeout(30000),
              catchError((e: any) => {
                console.log(e);
                if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para borrar el carrito de compras : ${e.status} - ${e.statusText}`);    
                }
                else {
                  throw new Error(`Consultando el servicio para borrar el carrito de compras`);
                }
              })
            )
            .subscribe((data : any )=> {
                if(data.success == 201) {
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
