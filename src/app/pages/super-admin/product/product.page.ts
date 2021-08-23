import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { FairsService } from './../../../api/fairs.service';
import { ProductsService } from './../../../api/products.service';
import { PavilionsService } from './../../../api/pavilions.service';
import { StandsService } from './../../../api/stands.service';
import { AdminProductsService } from './../../../api/admin/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  
  fair: any;
  pavilion: any;
  stand: any;
  product: any;
  productId: any;
  errors: string = null;
  success: string = null;
  editSave = false;
  
  
  constructor(
    private adminProductsService: AdminProductsService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private alertCtrl: AlertController,
    private fairsService: FairsService,
    private pavilionsService: PavilionsService,
	private standsService: StandsService,
	private productsService: ProductsService,
    private router: Router
    ) { }

  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  ngOnInit() {
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.loading.present({message:'Cargando...'});
    this.errors = null;
	
	this.fairsService.getCurrentFair()
      .then((fair) => {
            this.fair = fair;
			this.fair.pavilions.forEach((pavilion)=>{
				if(pavilion.id == pavilionId ) {
					this.pavilion = pavilion;
					for(let stand of this.pavilion.stands) {
					  if(Number(stand.id)  === Number(standId)) { 
					    this.stand = stand;
						break;
					  }
					}
				}
			});
            if(this.productId) {
				this.productsService.get(this.fair.id,this.pavilion.id,this.stand.id, this.productId)
				.then((products) => {
					this.loading.dismiss();
					this.product = products[0];
				  })
				  .catch(error => {
					 this.loading.dismiss();
					 this.errors = error;
				  });
			 }
			 else {
				 this.productsService.get(this.fair.id,this.pavilion.id,this.stand.id, this.productId)
				.then((products) => {
					this.loading.dismiss(); 
					this.product = { 'name': 'Producto #' + (products.length + 1 ), 'description':  'Descripción producto #' + (products.length + 1 ), 'prices': [], 'resources': {'scenes':[{'url_image':'https://dummyimage.com/648x300/EFEFEF/000.png'}]} }
					this.editSave = true;
				    this.loading.dismiss();
				  })
				  .catch(error => {
					 this.loading.dismiss();
					 this.errors = error;
				  });
				
			 }
	  });
  }
  
  updateProduct(){
    this.loading.present({message:'Cargando...'});
    if(this.product.id) {
        this.adminProductsService.update(Object.assign({'fair_id':this.fair.id,'pavilion_id':this.pavilion.id,'stand_id':this.stand.id},this.product))
       .then((product) => {
          this.loading.dismiss();
          this.errors = null;
          this.success = `Producto modificado exitosamente`;
          this.fairsService.refreshCurrentFair();
          this.pavilionsService.refreshCurrentPavilion();
          this.onRouterLink(`/super-admin/product/${product.id}`);
          this.product = product;
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });
    }
    else {
      
	  this.adminProductsService.create(Object.assign({'fair_id':this.fair.id,'pavilion_id':this.pavilion.id,'stand_id':this.stand.id},this.product))
       .then((product) => {
          this.loading.dismiss();
          this.errors = null;
          this.success = `Producto creado exitosamente`;
          this.fairsService.refreshCurrentFair();
          this.pavilionsService.refreshCurrentPavilion();
          this.onRouterLink(`/super-admin/product/${product.id}`);
      })
      .catch(error => {
         this.loading.dismiss();
         this.errors = error;
      });
    }
  }
  
  async deleteProduct() {
    
      const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borrar producto?',
      subHeader: 'Confirmar para borrar el producto',
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
            this.adminProductsService.delete(this.product.id)
              .then((response) => {
                   this.success = `Producto borrado exitosamente`;
                   const tab = `/super-admin/stand/${this.pavilion.id}`;
                   this.onRouterLink(tab);
                
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
  
  onRouterLink(tab) {
    this.router.navigate([tab]);
  }

  onAddImagen(){
	  
  }
}
