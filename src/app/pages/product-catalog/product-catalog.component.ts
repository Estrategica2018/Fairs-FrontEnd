import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import { ProductsService } from '../../api/products.service';


@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss'],
})
export class ProductCatalogComponent implements OnInit {
  
  @Input() banner: any;
  @Input() editorMode: any;
  @Input() fair: any;
  @Input() pavilion: any;
  @Input() stand: any;
  @Input() product: any;
  products: any;
  
  constructor(private productsService: ProductsService) { }

  ngOnInit() {
  } 
  
  initialize() {
	  
	this.products = [];
	
    if(this.banner.productCatalog) {
		
      let str = this.banner.productCatalog.list.split(';')[0];    
      const pavilion = str.split(':')[1];
      str = this.banner.productCatalog.list.split(';')[1];
      const stand = str.split(':')[1];
      str = this.banner.productCatalog.list.split(';').length==3 ? this.banner.productCatalog.list.split(';')[2] : null;
      const category = str ? str.split(':')[1] : '';
	
	  this.productsService.get(this.fair.id,pavilion,stand,null)
	  .then((products) => {
		if(products.length > 0) {
			products.forEach((product)=>{
				if(category == 'all' || product.category_id == category ){
					product.url_image = product.resources && product.resources.main_url_image ? product.resources.main_url_image : product.prices[0].resources.images[0].url_image;
					this.renderPrice(product);
					this.products.push(product);
				}
			});
		}
	  })
	  .catch(error => {
		
	  });   
	}
	this.onResize();

  }
  
  
  onResize() {
    
  }
  
  goToProduct(product) {

      if( typeof this.editorMode === 'undefined' || !this.editorMode ) {
         window.location.href= '/#/product-detail/'+this.pavilion.id+'/'+product.stand_id+'/'+product.id;
      }
  }
  
  renderPrice(product) {
	  
  }
  
}
