import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present(data) {
    this.isLoading = true;
    return await this.loadingController.create(data).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    try { 
       this.isLoading = false;
       return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }catch(e) {}
  }
}
