import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, timeout, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { processData } from '../providers/process-data';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FairsService {

  url = '';
  refresTime = null;
  fair = null;
  fairName: string;

  constructor(private http: HttpClient) { }

  list(fairName): any {

    return new Promise((resolve, reject) => {
        this.http.get(`${SERVER_URL}/api/fair/to_list/${fairName}`)
       .pipe(
          timeout(60000),
          catchError((e: any) => {
            console.log(e);
            if(e.status && e.statusText && e.statusText.indexOf('Gateway Timeout') >= 0) {
                throw new Error(`No está conectado a internet`);
            }
            else if(e.status && e.statusText) {
              throw new Error(`Consultando el servicio de feria: ${e.status} - ${e.statusText}`);
            }
            else {
              throw new Error(`Consultando el servicio de feria`);
            }
          })
        )
        .subscribe((data : any )=> {
            if(data.data)
            data.data.forEach((fair)=>{
              fair.social_media = fair.social_media ? JSON.parse(fair.social_media) : null;
            });

            resolve(data);
        },error => reject(error));
    });
  }

  refreshCurrentFair(): any {
    this.fair = null;
  }

  getCurrentFair(): any {

    if(this.fair === null || moment().isAfter(moment(this.refresTime).add(120 , 'seconds'))) {
        return new Promise((resolve, reject) => {
            try {
                if(environment.production ) {
                     let url = window.location.href;
                     url = url.replace('https:','').replace('http:','').replace('//www.','').replace('//','');
                     this.fairName = url.split('.')[0];
                }
                else {
                   this.fairName = environment.fairName;
                }

            } catch(error) {
                reject(`No se encontró nombre de la feria`);
            }

            this.list(this.fairName)
             .then((data) => {
                 
                if(data && data.success == 201 && data.data ) {
                  if(this.fairName.toUpperCase() == 'ADMIN') {
                    resolve({ 'name':'admin'});
                  }
                  else
                  for(let fair of data.data ) {
                    
                    fair.redirectTo = fair.redirectTo || 'map-site/fair/7';

                    if(fair.name.toUpperCase()=== this.fairName.toUpperCase()) {
                      this.refresTime = moment();
                      this.fair = processData(fair);
                      let pavilion=null;

                      for(let i=0;i<this.fair.pavilions.length; i++) {
                         pavilion = this.fair.pavilions[i];
                         pavilion.hasSceneStands = null;
                         if(pavilion.resources && pavilion.resources.scenes) {
                           for(let scene of pavilion.resources.scenes) {
                              if(scene.type == 'stands') {
                                 pavilion.hasSceneStands = i + 1;
                                 break;
                              }
                           }
                         }
                      }
                      this.fair.social_media = this.fair.social_media  || {};

                      const themeWrapper = document.querySelector('body');
                      let root = document.documentElement;
                      this.fair.social_media.iconMenuColor = this.fair.social_media.iconMenuColor || '#1A1A1A';
                      this.fair.social_media.iconMenuColorText = this.fair.social_media.iconMenuColorText || '#1A1A1A';
                      this.fair.social_media.iconColorText = this.fair.social_media.iconColorText || '#1A1A1A';
                      this.fair.social_media.iconMenuLogin = this.fair.social_media.iconMenuLogin || '#3171e0';
                      this.fair.social_media.iconColorToolbar = this.fair.social_media.iconColorToolbar || '#f4f5f8';

                      root.style.setProperty('--iconMenuColor', this.fair.social_media.iconMenuColor);
                      root.style.setProperty('--iconMenuColorText', this.fair.social_media.iconMenuColorText);
                      root.style.setProperty('--iconColorText', this.fair.social_media.iconColorText);
                      root.style.setProperty('--iconMenuLogin', this.fair.social_media.iconMenuLogin);
                      root.style.setProperty('--iconColorToolbar', this.fair.social_media.iconColorToolbar);

                      resolve(this.fair);
                      return;
                    }
                  }
                }
                reject(`No se encontraron datos para la feria: ${this.fairName}`);
                //window.location.href = SERVER_URL;
              },error => {
                reject(error)
             })
            .catch(error => {
                reject(error)
             });
        });
    }
    else {
        return new Promise((resolve, reject) => resolve(this.fair));
    }
  }

  sendMessage(messageData): Promise<any> {

        return new Promise((resolve, reject) => {

            this.http.post(`${SERVER_URL}/api/fair/contactsupport/notification`,messageData)
            .pipe(
              timeout(60000),
              catchError((e: any) => {
                console.log(e);
                /*if(e.status && e.statusText) {
                  throw new Error(`Consultando el servicio para envío de mensajes: ${e.status} - ${e.statusText}`);
                }*/
                throw new Error(`Consultando el servicio para envío de mensajes`);
              })
            )
            .subscribe((data : any )=> {
                if(data.success) {
                  resolve(data);
                }
                else {
                  console.log(data);    
                  reject("Error enviando el mensaje al correo electrónico");
                }
            },error => {
                reject(error)
            });
        });
  }

  skipPavilionIntro = [];

  getPavilionIntro(name){
    return this.skipPavilionIntro[name] || false;
  }

  setPavilionIntro(name){
    this.skipPavilionIntro[name] = true;
  }

  getCategories(type){
    return new Promise((resolve, reject) => {
        this.http.get(`${SERVER_URL}/api/category/to_list/${type}`)
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

    updateCategory(category){
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

    showRegister(fair,userDataSession): any {

      return new Promise((resolve, reject) => {
        const httpOptions = {
          headers: new HttpHeaders({
              'Authorization':  'Bearer ' + userDataSession.token
          })
        };
          this.http.get(`${SERVER_URL}/api/user/mincultura/show-register/${fair.id}`,httpOptions)
         .pipe(
            timeout(60000),
            catchError((e: any) => {
              console.log(e);
              if(e.status && e.statusText && e.statusText.indexOf('Gateway Timeout') >= 0) {
                  throw new Error(`No está conectado a internet`);
              }
              else if(e.status && e.statusText) {
                throw new Error(`Consultando el servicio de feria: ${e.status} - ${e.statusText}`);
              }
              else {
                throw new Error(`Consultando el servicio de feria`);
              }
            })
          )
          .subscribe((data : any )=> {
              resolve(data);
          },error => reject(error));
      });
    }

}
