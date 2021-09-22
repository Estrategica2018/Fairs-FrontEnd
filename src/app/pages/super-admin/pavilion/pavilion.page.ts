import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { PavilionsService } from './../../../api/pavilions.service';
import { AdminPavilionsService } from './../../../api/admin/pavilions.service';
import { AlertController } from '@ionic/angular';
import { FairsService } from './../../../api/fairs.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pavilion',
  templateUrl: './pavilion.page.html',
  styleUrls: ['./pavilion.page.scss'],
})
export class PavilionPage implements OnInit {

  pavilion: any;
  stands: any;
  errors: string = null;
  success: string = null;
  editSave = false;
  fair = null;
  
  constructor(
    private pavilionsService: PavilionsService,
    private adminPavilionsService: AdminPavilionsService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private alertCtrl: AlertController,
    private fairsService: FairsService,
    private router: Router
    ) { }

  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  ngOnInit() {
    this.loading.present({message:'Cargando...'});
    this.errors = null;
    const listPav = this.pavilionsService.list()
    .then((response) => {
        
        const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
        if(pavilionId){
          this.pavilionsService.get(pavilionId)
           .then((response) => {
              this.pavilion = response.pavilion;
              this.stands = [];
			  this.pavilion.stands.forEach((stand)=>{
				this.stands.push(Object.assign({},stand)); 
			  });
			  
			  console.log(this.stands);
              this.fair = response.fair;
			  
              this.loading.dismiss();
          })
          .catch(error => {
             this.loading.dismiss();
             this.errors = error;
          });
        } else {
            this.fair = response.fair;
            if(this.fair && this.fair.pavilions){
                const main = document.querySelector<HTMLElement>('ion-router-outlet');
            
                this.pavilion = { 'name':'Pabellón #' + (this.fair.pavilions.length + 1),
                             'description': 'Descripción Pabellón #' + (this.fair.pavilions.length + 1),
                             'resources':  {'scenes':[]} 
                };
                
                this.fair.pavilions.push(this.pavilion);
                this.loading.dismiss();
            }
        } 
      })
      .catch(error => {
         this.loading.dismiss();
         this.errors = error;
        });
  }
  
  updatePavilion(){
	  console.log(this.stands);
    this.loading.present({message:'Cargando...'});
    if(this.pavilion.id) {
        this.adminPavilionsService.update(this.pavilion)
       .then((pavilion) => {
		   console.log(this.stands);
          this.loading.dismiss();
          this.editSave = false;
          this.errors = null;
          this.success = `Pabellón modificado exitosamente`;
          this.pavilion = pavilion;
          this.fairsService.refreshCurrentFair();
          this.pavilionsService.refreshCurrentPavilion();
          //this.redirectTo(`/super-admin/pavilion/${pavilion.id}`);
		  this.pavilionsService.get(pavilion.id)
           .then((response) => {
              this.pavilion = response.pavilion;
              this.stands = this.pavilion.stands;
			  console.log(this.stands);
              this.fair = response.fair;
			  
              this.loading.dismiss();
          })
          .catch(error => {
             this.loading.dismiss();
             this.errors = error;
          });
		  
          //window.location.href = `/#/super-admin/pavilion/${pavilion.id}`;
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });
    }
    else {
      this.pavilion.fair_id = this.fair.id;
      this.adminPavilionsService.create(this.pavilion)
       .then((pavilion) => {
          this.loading.dismiss();
          this.errors = null;
          this.editSave = false;
          this.success = `Pabellón creado exitosamente`;
          this.fairsService.refreshCurrentFair();
          this.pavilionsService.refreshCurrentPavilion();
          this.redirectTo(`/super-admin/pavilion/${pavilion.id}`);
          //window.location.href = `/#/super-admin/pavilion/${pavilion.id}`;
      })
      .catch(error => {
         this.loading.dismiss();
         this.errors = error;
      });
    }
  }
  
  async deletePavilion() {
    
      const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borrar pabellón?',
      subHeader: 'Confirma para borrar el pabellón',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {
            this.adminPavilionsService.delete(this.pavilion)
              .then((response) => {
                
                   this.success = `Pabellón borrado exitosamente`;
                   this.fairsService.refreshCurrentFair();
                   this.pavilionsService.refreshCurrentPavilion();
                   this.fair.pavilions = this.fair.pavilions.filter((pavilion)=>{
                        return pavilion.id != this.pavilion.id;
                   });
                    
                   const tab = `/super-admin/fair`;
                   this.redirectTo(tab);
                
              },
              (error) => {
                  this.errors = error;
             })
            .catch(error => {
                this.errors = error; 
             });        

          }
        }
      ]
    });
    await alert.present();
  }
   
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }

}
