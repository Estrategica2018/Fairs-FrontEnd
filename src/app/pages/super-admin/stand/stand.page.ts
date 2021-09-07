import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { FairsService } from './../../../api/fairs.service';
import { StandsService } from './../../../api/stands.service';
import { ProductsService } from './../../../api/products.service';
import { MerchantsService } from './../../../api/merchants.service';
import { AdminStandsService } from './../../../api/admin/stands.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController,ActionSheetController } from '@ionic/angular';
import { PavilionsService } from './../../../api/pavilions.service';

@Component({
  selector: 'app-stand',
  templateUrl: './stand.page.html',
  styleUrls: ['./stand.page.scss'],
})
export class StandPage implements OnInit {

  stand: any;
  editSave: any;
  pavilion: any;
  merchants: any;
  merchant: any;
  fair = null;
  errors: string = null;
  success: string = null;
  productCatalogList = null;
  
  constructor(
    private adminStandsService: AdminStandsService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private fairsService: FairsService,
    private pavilionsService: PavilionsService,
    private standsService: StandsService,
    private productsService: ProductsService,
    private merchantsService: MerchantsService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private alertCtrl: AlertController,
    ) { }
    
  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

  ngOnInit() {
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    this.loading.present({message:'Cargando...'});
    this.fairsService.getCurrentFair()
      .then((fair) => {
          this.fair = fair;
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId ) {
                 this.pavilion = pavilion;
              }
          })
          
          this.merchantsService.list()
          .then((merchants) => {
              this.merchants = merchants;
              
              if(standId) {
                  this.standsService.get(pavilionId,standId)
                   .then((stand) => { 
                      this.stand = stand;
                      if(this.stand.merchant) {
                        this.merchant = this.stand.merchant;
                        this.stand.merchant_id = this.stand.merchant.id;
                      }
                      
                      this.productsService.get(this.fair.id,this.pavilion.id,this.stand.id,null)
                      .then((products) => {
                          this.loading.dismiss();
                          this.errors = null;
                          
                          //create product catalog list
                          this.productCatalogList = [];
                          products.forEach((product)=>{
                              product.url_image = product.prices[0].resources.images[0].url_image;
                              let hasCategory = false;
                              let category = null;
                              if(this.productCatalogList.length > 0) {
                                this.productCatalogList.forEach((cat)=>{
                                  if(cat.name == product.category.name) {
                                     hasCategory = true;
                                     category = cat;
                                  }
                                });
                              }
                              if(!hasCategory) {
                                category = {'id':product.category.id,'name':product.category.name, 'products': []};
                                this.productCatalogList.push(category);
                              }
                              product.url_image = product.prices && product.prices.length > 0 && product.prices[0].resources.images[0].url_image ? product.prices[0].resources.images[0].url_image : 'https://cdn.shopify.com/s/files/1/0259/1467/1186/products/001AAAA854034016_03_500x.jpg?v=1572573226';
                              category.products.push(product);
                          });
                          
                      })
                      .catch(error => {
                         this.loading.dismiss();
                         this.errors = error;
                      });

                  })
                  .catch(error => {
                     this.loading.dismiss();
                     this.errors = error;
                  });
                }
                else {
                    this.stand = { 
                         'nick':' #Nuevo Local Comercial',
                         'name': 'Descripción local comercial',
                         'resources':  {'scenes':[]} 
                   };
                   this.loading.dismiss();
                }
              
          })
          .catch(error => {
             this.errors = error;
             this.loading.dismiss();
          });
      })
      .catch(error => {
          this.loading.dismiss();
         this.errors = error;
      });
  }
  
  updateStand() {
      this.loading.present({message:'Cargando...'});
      this.stand.pavilion_id = this.pavilion.id;
      this.stand.merchant_id = this.merchant.id;
      
      if(this.stand.id) {
          this.adminStandsService.update(this.stand)
          .then((stand) => {
             this.loading.dismiss();
             this.fairsService.refreshCurrentFair();
             this.pavilionsService.refreshCurrentPavilion();
             this.success = `Local comercial modificado exitosamente`;
             this.errors = null;
             this.stand = stand;
             window.location.href = `/#/super-admin/stand/${this.pavilion.id}/${stand.id}`;
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
      }
      else {
          this.stand.stand_type_id = 1;
          this.adminStandsService.create(this.stand)
          .then((stand) => {
             this.loading.dismiss();
             this.errors = null;
             this.stand = stand;
             this.fairsService.refreshCurrentFair();
             this.pavilionsService.refreshCurrentPavilion();
             this.success = `Local comercial creado exitosamente`;
             //this.onRouterLink(`/super-admin/stand/${this.pavilion.id}/${stand.id}`);
             window.location.href = `/#/super-admin/stand/${this.pavilion.id}/${stand.id}`;
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
      }
  }
  
  async deleteStand() {
      
    
      const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borrar Local comercial?',
      subHeader: 'Confirma para borrar el local comercial',
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
              
            this.adminStandsService.delete(this.stand)
              .then((response) => {
                   this.success = `Local comercial borrado exitosamente`;
                   this.fairsService.refreshCurrentFair();
                   this.pavilionsService.refreshCurrentPavilion();
                   //this.onRouterLink(`/super-admin/pavilion/${this.pavilion.id}`);
                   
                   window.location.href = `/#/super-admin/pavilion/${this.pavilion.id}`;
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
  
  onChangeItem() {
      this.editSave = true;
  }
  
  onChangeMerchant() {
     this.merchants.forEach((merchant)=>{
         if( merchant.id == this.stand.merchant_id) {
             this.merchant = merchant;
         }
     });
     
     this.editSave = true;
  }
  
  async presentActionMerchant() {
    let merchant = null; 
    let buttons = [];

    for (let i = 0; i < this.merchants.length; i++) {
      merchant = this.merchants[i];
      let style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = '.customCSSClass' + i + '{background: url(' + "'" + merchant.resources.url_image + "'" + ') no-repeat !important;background-size: 50px 50px !important;margin-left: 31px;padding-left: 63px !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      buttons.push({
        text: merchant.nick, 
        role: 'destructive', 
        cssClass: 'customCSSClass' + i,
        handler: () => {
          this.merchant = this.merchants[i];
          this.editSave = true;
        }
      });
    }     
    
    buttons.push({
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      });
      
      
    const actionSheet = await this.actionSheetController.create({
      header: 'Comercios',
      cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  
  
  addNewProduct() {
   
  }
  
  onRouterLink(tab) {
    this.router.navigate([tab]);
  }
  
}
