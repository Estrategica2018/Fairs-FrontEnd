import { Component, OnInit } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { ProductsService } from './../../../../api/products.service';
import { LoadingService } from './../../../../providers/loading.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

  
  template: any;
  catalogList: any;
  fair: any;
  pavilion: any;
  stand: any;
  products: any;
  category: any;
  showProducts = false;
  categorySelected = '';
  showOnlyOne = false;
  
  constructor(private modalCtrl: ModalController,
    private navParams: NavParams,
    private loading: LoadingService,
    private productsService: ProductsService) { }

  ngOnInit() {
      
      this.loading.present({message:'Cargando...'});
      this.template = this.navParams.get('template');
      this.fair = this.navParams.get('fair');
      this.pavilion = this.navParams.get('pavilion');
      this.stand = this.navParams.get('stand');
      
      if(this.template == 'fair') {
          
          this.productsService.get(this.fair.id,null,null,null)
          .then((products) => {
              
              this.loading.dismiss();
          })
          .catch(error => {
             this.loading.dismiss();
          });
      }
      else if(this.template == 'pavilion') {
          const pavilion = { 'id': this.pavilion.id, 'name': this.pavilion.name, 'stands': []};
          this.pavilion.stands.forEach((st)=>{
              const stand = { id: st.id, merchant: st.merchant };
              pavilion.stands.push(Object.assign({},stand));
          });
          this.catalogList = [];
          this.catalogList.push(pavilion);
          
          
          this.productsService.get(this.fair.id,this.pavilion.id,null,null)
          .then((products) => {
              if(products.length>0) {
                  products.forEach((product)=>{                       
                      const category = this.getCategory(product);
                      category.products = category.products || [];
                      product.url_image = product.resources && product.resources.main_url_image ? product.resources.main_url_image : product.prices[0].resources.images[0].url_image;
                      category.products.push(product);
                  });
              }
              this.loading.dismiss();
          })
          .catch(error => {
             this.loading.dismiss();
          });
      }
      else if(this.template == 'stand') {
          const pavilion = { 'id': this.pavilion.id, 'name': this.pavilion.name, 'stands': []};
          this.pavilion.stands.forEach((st)=>{
              if(this.stand.id==st.id) {
                const stand = { id: st.id, merchant: st.merchant };
                pavilion.stands.push(Object.assign({},stand));
              }
          });
          this.catalogList = [];
          this.catalogList.push(pavilion);
          
          
          this.productsService.get(this.fair.id,this.pavilion.id,this.stand.id,null)
          .then((products) => {
              if(products.length>0) {
                  products.forEach((product)=>{                       
                      const category = this.getCategory(product);
                      category.products = category.products || [];
                      product.url_image = product.resources && product.resources.main_url_image ? product.resources.main_url_image : product.prices[0].resources.images[0].url_image;
                      category.products.push(product);
                  });
              }
              this.loading.dismiss();
          })
          .catch(error => {
             this.loading.dismiss();
          });
      }
  }

  getPavilion(product) {
    let pavilion: any;
    this.fair.pavilions.forEach((pav)=>{
        pavilion = pav;
    });
    return pavilion;
  }
  
  
  getPavilion2(product) {
    let pavilion: any;
    this.fair.pavilions.forEach((pav)=>{
      pav.stands.forEach((stand)=>{
        if(stand.id === product.stand_id) {
           pavilion = pav;
        }
        });
    });
    return pavilion;
  }

  getCategory(product) {
    let category: any;
    this.catalogList.forEach((pav)=>{
      pav.stands.forEach((st)=>{
         if(st.id === product.stand_id) {
            let mbControl = false;
            st.categories = st.categories || [];
            st.categories.forEach((cat)=>{
               if(cat.id === product.category_id) {
                 category = cat;
               }
            });
            if(!category) {
              category = { 'id': product.category.id, 'name': product.category.name, 'resources': product.category.resources};
              st.categories.push(category);
            }
         }
       })
    });
    
    return category;
    
  }

  openProducts(category, stand, pavilion) {
      
      if(category) {
         this.categorySelected = 'pavilion:' + pavilion.id + ';stand:'+stand.id + ';category:'+category.id;
         this.showProducts = true;
         this.products = category.products;
         this.category = category;
      }
      else if(stand) {
          this.categorySelected = 'pavilion:' + pavilion.id + ';stand:'+stand.id + ';category:all';
          this.products = [];
          this.category = { 'name': 'Todas las categorias' };
          this.catalogList.forEach((pavilion)=>{
             pavilion.stands.forEach((st)=>{
                 if(st.id === stand.id) {
                    st.categories.forEach((cat)=>{
                        cat.products.forEach((pr)=>{
                         this.products.push(pr);
                        });
                    });
                 }
             });
          });
      }
  }
  
  dismissModal() {
     this.modalCtrl.dismiss(null);
  }

  acceptModal() {
     this.modalCtrl.dismiss( { "categorySelected":this.categorySelected, "products":this.products } );
  }

}

