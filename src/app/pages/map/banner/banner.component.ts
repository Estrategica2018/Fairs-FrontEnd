import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

  @Output() changeItem = new EventEmitter<any>();
  @Output() bannerSelect = new EventEmitter<any>();
  @Output() editProduct = new EventEmitter<any>();
  @Output() changePriceProduct = new EventEmitter<any>();
  @Input() banner: any;
  
  bannerSelectHover: any;
  
  constructor(private animationCtrl: AnimationController,) { }

  ngOnInit() {}

  onChangeItem() {
      this.changeItem.emit(true);
  }
  
  onBannerSelect(banner) {
     this.bannerSelect.emit(banner);
  }
  
  changePriceProductCatalog(product) {
      this.changePriceProduct.emit(product);
  }

  goToEditProduct(product){
      if(this.editProduct) this.editProduct.emit(product);
      if(this.editProduct) this.editProduct.emit(product);
  }
  
  dragBannerEnd($event,banner) {
    banner.position.y += $event.y;
    banner.position.x += $event.x;
    this.onChangeItem();
  }
  
  async startAnimation(obj) {

    if(!obj.hoverEffects) return;
    
    if(obj.hoverEffects.includes('GirarDerecha')) {
      const squareA = this.animationCtrl.create()
      .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))
      
      .duration(1000)
      .keyframes([
        { offset: 0, transform: 'rotate(0)' },
        { offset: 0.5, transform: 'rotate(45deg)' },
        { offset: 1, transform: 'rotate(0) '}
      ]);
      await squareA.play();
    }
    if(obj.hoverEffects.includes('GirarIzquierda')) {
      const squareA = this.animationCtrl.create()
      .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))
      
      .duration(1000)
      .keyframes([
        { offset: 0, transform: 'rotate(0)' },
        { offset: 0.5, transform: 'rotate(-45deg)' },
        { offset: 1, transform: 'rotate(0) '}
      ]);
      await squareA.play();
    }
  }
  
}
