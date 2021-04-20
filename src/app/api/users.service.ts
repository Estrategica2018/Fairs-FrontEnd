import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url= '';
  HAS_LOGGED_IN = 'hasLoggedIn'; 
  
  constructor(
    private http: HttpClient,
    private storage: Storage) { 
  }
  
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/api/login`, {email: email, password: password})
   .pipe(
      timeout(2000),
      catchError(e => {
        if(e.status == 422) {
          throw new Error(`Usuario o contraseña incorrectos`);
        }
        else {
            console.log(e);
            throw new Error(`Csonsumiendo el servicio para el inicio de sesión: ${e.status} - ${e.statusText}`);
        }
      })
    )
  }
  
  logout(userDataSession): Observable<any> {
 
    const httpOptions = {
    headers: new HttpHeaders({
      'Authorization':  'Bearer ' + userDataSession.token
      })
    };
  
    return this.http.post(`${this.url}/api/logout`,{},httpOptions)
   .pipe(
      timeout(2000),
      catchError(e => {
        if(e.status !== 401) {
           console.log(e);
           throw new Error(`Consumiendo el servicio para el inicio de sesión: ${e.status} - ${e.statusText}`);
        }
        return of(null);
      })
    )
  }
  
  signup(userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this.http.post(`${this.url}/api/user/create`,userData)
       .pipe(
          timeout(2000),
          catchError(e => {
            if(e.status == 401) {
               throw new Error(`Usuario ya existe`);
            }
            else {
               if(e.status && e.statusText) {
                  throw new Error(`Consumiendo el servicio para creación del usuario: ${e.status} - ${e.statusText}`);
               }
               else {
                   throw new Error(`Consumiendo el servicio para creación del usuario`);
               }
            }
          })
        )
        .subscribe((data : any )=> {
            if(data.success === 201) {
              resolve(data);
            }
            else if(data.data && data.data.email) {
                reject(`Correo electrónico ya registrado`);
            }
            else {
                reject(`Consumiendo el servicio para creación del usuario`);
            }
        },error => reject(error));
        
    });
  }

  isLoggedIn(): Promise<string> {
    return this.storage.get(this.HAS_LOGGED_IN).then((user) => {
      return user;
    });
  }
  
  setUser(userDataSession: any): Promise<boolean> {
    if(userDataSession) return this.storage.set(this.HAS_LOGGED_IN,userDataSession);
    else return this.storage.remove(this.HAS_LOGGED_IN);
  }
  
  getUser(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN);
  }
 
  updateUser(userDataSession: any, userData: any): Observable<any> {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':  'Bearer ' + userDataSession.token
      })
    };
	
	return this.http.post(`${this.url}/api/user/update`,userData, httpOptions)
   .pipe(
      timeout(2000),
      catchError(e => {
        if(e.status == 401) {
           throw new Error(`Usuario ya existe`);
        }
        else {
           if(e.status && e.statusText) {
              throw new Error(`Consumiendo el servicio para modificación del usuario: ${e.status} - ${e.statusText}`);
           }
           else {
               throw new Error(`Consumiendo el servicio para modificación del usuario`);
           }
        }
      })
    )
  }

  
}
