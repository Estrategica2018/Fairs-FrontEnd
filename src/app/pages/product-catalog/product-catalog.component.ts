import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ProductsService } from '../../api/products.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AlertController, ModalController, IonRouterOutlet,ToastController } from '@ionic/angular';

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
  @Output() onShowProduct = new EventEmitter<any>();
  products: any;
  
  constructor(
    private productsService: ProductsService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet
  ) { }

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
    const el = document.querySelector<HTMLElement>('#grid-'+this.banner.id);
	el.style.setProperty('--width', this.banner.size.x + 'px' );
	el.style.setProperty('--height', this.banner.size.y + 'px' );
	//el.style.setProperty('font-size', this.banner.fontSize + 'px' );
  }
  
  onRender(deltaW,deltaH) {
    const el = document.querySelector<HTMLElement>('#grid-'+this.banner.id);
	const nW: any = el.style.getPropertyValue('--width').replace('px','');
	const nH: any = el.style.getPropertyValue('--height').replace('px','');
	el.style.setProperty('--width', (nW / deltaW) + 'px' );
    el.style.setProperty('--height', (nH / deltaH) + 'px' );
	const elname = document.querySelector<HTMLElement>('#grid-col-'+this.banner.id + ' h2');
	const fs: any = elname.style.getPropertyValue('font-size').replace('px','');
	elname.style.setProperty('font-size', (fs / deltaW)  + 'px' );
  }

  
  goToProduct(product) {

      if( typeof this.editorMode === 'undefined' || !this.editorMode ) {
         window.location.href= '/#/product-detail/'+this.pavilion.id+'/'+product.stand_id+'/'+product.id;
      }
  }
  
  renderPrice(product) {
	let minValue = 0;
	let maxValue = 0;
    product.prices.forEach((price)=>{
		
	})
  }
  
  onShowProductEl(product) {
	product.pavilion = this.pavilion
	this.onShowProduct.emit(product);
  }
}
