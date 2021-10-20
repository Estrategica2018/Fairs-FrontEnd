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
  @Output() onChangePrice = new EventEmitter<any>();
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
    const titles = document.querySelectorAll<HTMLElement>('.grid-col-'+this.banner.id + ' .name');
    titles.forEach((title)=>{
        if(title) {
          let fs: any = title.style.getPropertyValue('font-size').replace('px','');
          if(fs && fs != "") {
            title.style.setProperty('font-size', (fs / deltaW)  + 'px' );
          }
          else {
            title.style.setProperty('font-size', 21/deltaW  + 'px' );
          }
        }
    });
    
    const descriptions = document.querySelectorAll<HTMLElement>('.grid-col-'+this.banner.id + ' .description');
    descriptions.forEach((desc)=>{
        let height = document.querySelector<HTMLElement>('.button-show').offsetTop;
        desc.style.setProperty('height', ( height * 0.8 )+ 'px' );
    });
    
    const colors = document.querySelectorAll<HTMLElement>('.container-carousel');
    colors.forEach((color)=>{
        let height = document.querySelector<HTMLElement>('.button-show').offsetTop;
        console.log(height);
        color.style.setProperty('height', ( height * 0.8 )+ 'px' );
    });
    
    const btns = document.querySelectorAll<HTMLElement>('.button-show');
    btns.forEach((btn)=>{
        
      //btn.style.setProperty('width', 102/deltaW  + 'px' );
      //btn.style.setProperty('height', 25/deltaH  + 'px' );
      
      
      let height: any = btn.style.getPropertyValue('height').replace('px','');
      if(height && height != "") {
        btn.style.setProperty('height', height / deltaH  + 'px' );
      }
      else {
        btn.style.setProperty('height', 25 / deltaH  + 'px' );
      }
      
      let width: any = btn.style.getPropertyValue('width').replace('px','');
      if(width && width != "") {
        btn.style.setProperty('width', width / deltaW  + 'px' );
      }
      else {
        btn.style.setProperty('width', 160 / deltaW  + 'px' );
      }
      /*let bottom: any = btn.style.getPropertyValue('bottom').replace('px','');
      if(bottom && bottom != "") {
        btn.style.setProperty('bottom', bottom * deltaH  + 'px' );
      }
      else {
        btn.style.setProperty('bottom', (this.banner.size.y / 10 ) + 'px' );
      }*/
    });
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
  
  changePrice(price){
    this.onChangePrice.emit(price);
  }
}
