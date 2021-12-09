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

  list(fair: any, userDataSession: any): Promise<any> {
    
        return new Promise((resolve, reject) => {
            const httpOptions = {
                headers: new HttpHeaders({
                  'Authorization':  'Bearer ' + userDataSession.token
              })
            };     
            this.http.get(`/api/list/shopping-cart/list?fair_id=${fair.id}`,httpOptions)
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
           if(productPrice.resources.attributes) {
             productPrice.resources.attributes.forEach((attr)=>{
               if(attr.value && attr.value.split('|').length <= 1 && attributes.length < 5) {
                 attributes.push(attr);
               }
             });
           }
           if(product.resources.attributes) {
             product.resources.attributes.forEach((attr)=>{
               if(attr.value && attr.value.split('|').length <= 1 && attributes.length < 5) {
                 attributes.push(attr);
               }
             });
           }
           
           /*let attr = null;
           detail = '<table style="border-radius: 5px; border: 1px solid gray; width: 121.833%; height: 60px;">' +
                    '   <tbody>' +
                    '      <tr style="height: 29px; min-width: 12em;">' +
                    '         <td style="width: 33.3333%; min-width: 12em; height: 60px;" rowspan="100"><img style="display: block; margin-left: auto; margin-right: auto;" src="'+productPrice.resources.images[0].url_image+'" width="99" height="98" /></td>' +
                    '         <td style="width: 90.5011%; min-width: 12em; height: 33px; font-size: 20.3333px; font-family: YoutubeSansMedium; color: #004782; font-weight: 600; top: 8.84056px; left: 60.9998px;" colspan="3">&nbsp; &nbsp; '+product.name+'</td>' +
                    '      </tr>' +
                    '      <tr style="height: 10px;">' +
                    '         <td style="width: 35.0759%; min-width: 12em; height: 10px;">Color: Rosado</td>' +
                    '         <td style="display: block; width: 53.8252%; min-width: 12em; height: 10px;" rowspan="1000">' +
                    '            &nbsp; <span style="font-weight: bold;">Cantidad:</span> ' + amount +
                    '            <br/>' +
                    '            <br/>' +
                    '            <div><span style="font-weight: bold;">&nbsp; Precio:</span> $' + ( productPrice.price || product.price ) +'</div>' +
                    '         </td>' +
                    '      </tr>';
                    
           for(let i=0; i<attributes.length; i++) {
             attr = attributes[i];
             detail += 
                    '      <tr style="height: 17px;">' +
                    '         <td style="width: 35.0759%; min-width: 12em; height: 17px;">  &nbsp;  &nbsp; ' + ( attr.label || attr.name )+ ' : &nbsp; '+ ( attr.selected || attr.value ) + '</td>' +
                    '      </tr>';
           }
           
           detail += '   </tbody>' +
                    '</table>'; */

           price = ( productPrice.price || product.price );
           
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
       else if(agenda){
          price = ( agenda.price ); 
       }
       const data = {
           "fair_id": fair.id,
           "product_id": (product ? product.id : null),
           "product_price_id": (productPrice ? productPrice.id : null), 
           "agenda_id": (agenda ? agenda.id : null),
           "detail": detail,
           "price": '$ '+ price,
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
           this.http.post(`/api/update/shopping-cart/`,data,httpOptions)
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
           this.http.post(`/api/update/shopping-cart/`,data,httpOptions)
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
  
}
