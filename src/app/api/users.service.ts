import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Storage } from '@ionic/storage';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url= SERVER_URL;
  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(
    private http: HttpClient,
    private storage: Storage) {
  }

  login(email: string, password: string, fair_id: string): Observable<any> {
    return this.http.post(`${this.url}/api/login`, {email: email, password: password, fair_id: fair_id})
   .pipe(
      timeout(2000),
      catchError(e => {
        if(e.status == 422) {
          throw new Error(`Usuario o contraseña incorrectos`);
        }
        else {
            console.log(e);
            throw new Error(`Consumiendo el servicio para el inicio de sesión: ${e.status} - ${e.statusText}`);
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

  recoverPassword(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.url}/api/password/create`,data)
	   .pipe(
          timeout(30000),
          catchError(e => {
            if(e.status == 422) {
			  const message = e.error ? JSON.stringify(e.error) : `${e.status} - ${e.statusText}`;
              throw new Error(`Consumiendo el servicio para recuperación de clave: ${message}`);
            }
			else if(e.status == 404) {
			  throw new Error(`Usuario o Email no encontrado`);
            }
            else {
			  if(e.status && e.statusText) {
                throw new Error(`Consumiendo el servicio para recuperación de clave: ${e.status} - ${e.statusText}`);
              }
              else {
                throw new Error(`Consumiendo el servicio para recuperación de clave`);
              }
            }
          })
        )
        .subscribe((data : any )=> {
          if(data.success === 201) {
            resolve(data);
          }
          else {
            reject(`Consumiendo el servicio para recuperación de clave`);
          }
        },error => reject(error));

    });
  }
  
  findPassword(token): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.url}/api/password/find/${token}`)
	   .pipe(
          timeout(30000),
          catchError(e => {
            if(e.status == 422) {
			  const message = e.error ? JSON.stringify(e.error) : `${e.status} - ${e.statusText}`;
              throw new Error(`Consumiendo el servicio para recuperación de clave: ${message}`);
            }
			else if(e.status == 404 && e.error && e.error.message) {
			  throw new Error(`${e.error.message}`);
            }
            else {
			  if(e.status && e.statusText) {
                throw new Error(`Consumiendo el servicio para recuperación de clave: ${e.status} - ${e.statusText}`);
              }
              else {
                throw new Error(`Consumiendo el servicio para recuperación de clave`);
              }
            }
          })
        )
        .subscribe((data : any )=> {
          if(data.status === 'successfull') {
            resolve(data);
          }
          else {
            reject(`Consumiendo el servicio para recuperación de clave`);
          }
        },error => reject(error));

    });
  }

}
