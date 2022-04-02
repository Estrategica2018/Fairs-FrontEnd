import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { processData } from '../providers/process-data';
import { UsersService } from '../api/users.service';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartsService {

  url = '';
  refresTime = null;
  agendas = null;

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  list(fair: any, userDataSession: any): Promise<any> {
    
        return new Promise((resolve, reject) => {
            const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };     
            
            this.http.get(`${SERVER_URL}/api/list/shopping-cart/${fair.id}`,httpOptions)
            .pipe(
              timeout(60000),
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
                resolve(processData(data.data));
            },error => {
                reject(error)
                
            });
        });
  }
   
  
  addShoppingCart(fair: any, product: any, productPrice: any, agenda: any, amount: number, userDataSession : any): any {
    
    return new Promise((resolve, reject) => {
        
        const httpOptions = {
            headers: new HttpHeaders({
              'Authorization':  'Bearer ' + userDataSession.token
          })
        };
       
       let detail = '';
       let price = null;
       
       if(product && productPrice) {
           let attributes = [];
           let attrStr = '';
           if(productPrice.attributeSelect) {
             productPrice.attributeSelect.forEach((attr)=>{
               attributes.push(attr);
             });
           }
           if(product.attributeSelect) {
             product.attributeSelect.forEach((attr)=>{
              attributes.push(attr);
             });
           }
           if(productPrice.resources.attributes && productPrice.resources.attributes.length> 0) {
             productPrice.resources.attributes.forEach((attr)=>{
               if(attr.value && attr.value.split('|').length <= 1 && attributes.length < 5) {
                 attributes.push(attr);
               }
             });
           }
           if(product.resources.attributes && product.resources.attributes.length > 0) {
             product.resources.attributes.forEach((attr)=>{
               if(attr.value && attr.value.split('|').length <= 1 && attributes.length < 5) {
                 attributes.push(attr);
               }
             });
           }
           
           price = ( productPrice.price || product.price );
           
           if(attributes) {
             detail = '<div>';
             for(let i=0, attr = null; i<attributes.length; i++) {
               attr = attributes[i];
               detail += 
                    '      <div>' +
                       ( attr.label || attr.name )+ ' : &nbsp; '+ ( attr.selected || attr.value ) +
                    '      </div>';
             }
             detail += '</div>';
           }
       }
       else if(agenda){
          price = ( agenda.price ); 
       }
       const data = {
           "fair_id": fair.id,
           "product_id": (product ? product.id : null),
           "product_price_id": (productPrice ? productPrice.id : null), 
           "agenda_id": (agenda ? agenda.id : null),
           "detail": detail,
           "price": price,
           "amount": amount
       };
       
       this.http.post(`${SERVER_URL}/api/store/shopping-cart/${fair.id}`,data,httpOptions)
        .pipe(
          timeout(60000),
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
               window.dispatchEvent(new CustomEvent( 'user:shoppingCart'));
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
 
  removeShoppingCart(shoppingCart: any): any {
    
    return new Promise((resolve, reject) => {
        
        this.usersService.getUser().then((userDataSession: any)=>{ 
            const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
           const data = {'id': shoppingCart.id, 'state':'A'};
           this.http.post(`${SERVER_URL}/api/update/shopping-cart/`,data,httpOptions)
            .pipe(
              timeout(60000),
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
                if(data.success == 201 || data.success == true) {
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
  
  updateShoppingCart(shoppingCart: any): any {
    
    return new Promise((resolve, reject) => {
        
        this.usersService.getUser().then((userDataSession: any)=>{ 
            const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };
           const data = {'id': shoppingCart.id, 'amount':shoppingCart.amount};
           this.http.post(`${SERVER_URL}/api/update/shopping-cart/`,data,httpOptions)
            .pipe(
              timeout(60000),
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
                if(data.success == 201 || data.success == true) {
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

  find(fair: any, referenceId: string, userDataSession: any): Promise<any> {
    
        return new Promise((resolve, reject) => {
            const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };     
            console.log('/api/find/shopping');
            this.http.get(`${SERVER_URL}/api/find/shopping-cart/${fair.id}/${referenceId}`,httpOptions)
            .pipe(
              timeout(60000),
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
                resolve(processData(data.data));
            },error => {
                reject(error)
            });
        });
  }
   
  
}
