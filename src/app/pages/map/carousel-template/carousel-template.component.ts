import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import { ProductsService } from '../../../api/products.service';
import { IonSlides } from "@ionic/angular";

@Component({
  selector: 'app-carousel-template',
  templateUrl: './carousel-template.component.html',
  styleUrls: ['./carousel-template.component.scss'],
})
export class CarouselTemplateComponent {
  
  @Input() banner: any;
  @Input() editorMode: any;
  @Input() fair: any;
  @Input() pavilion: any;
  @Input() stand: any;
  @Input() product: any;
  //@ViewChild(IonSlides, { static: true }) ionSlides: IonSlides;
  @ViewChild('slides', { static: true }) ionSlides: IonSlides;
  
  slideOpts: any;
  items: any;
  finalHeight: any;
  
  constructor(private productsService: ProductsService) { }

  initialize() {
      
    if(this.ionSlides) this.ionSlides.update();
    this.items = [];
    
    if(this.banner.carousel.images) {
        this.banner.carousel.images.forEach((image)=>{
            if(image.list) {
              let str = image.list.split(';')[0];    
              const pavilion = str.split(':')[1];
              str = image.list.split(';')[1];
              const stand = str.split(':')[1];
              str = image.list.split(';').length==3 ? image.list.split(';')[2] : null;
              const category = str ? str.split(':')[1] : '';
              
              this.productsService.get(this.fair.id,pavilion,stand,null)
              .then((products) => {
                if(products.length > 0) {
                    products.forEach((product)=>{
                        if(category == 'all' || product.category_id == category ){
                            product.url_image = product.resources && product.resources.main_url_image ? product.resources.main_url_image : product.prices[0].resources.images[0].url_image;
                            this.items.push({'product': product});                            
                        }
                    });
                }
              })
              .catch(error => {
                 
              });
            }
            else {
                this.items.push({'image':true, 'url': image.url});
            }
        })
        
        this.onResize();
    }
  }
  
  onResize() {
    let slides = document.querySelector<any>('#ion-slides-'+this.banner.id);
    this.getSlideOpts();
    if(slides && this.banner && this.banner.carousel) {
        this.getSlideOpts();
        slides.options = this.slideOpts;
    }
  }
  
  goToProduct(product) {

      if( typeof this.editorMode === 'undefined' || !this.editorMode ) {
         window.location.href= '/#/product-detail/'+this.pavilion.id+'/'+product.stand_id+'/'+product.id;
      }
  }

  getSlideOpts() {
      this.slideOpts = {
            slidesPerView: this.banner.carousel.options.slidesPerView,
            coverflowEffect: {
              rotate: this.banner.carousel.options.rotate,
              stretch: this.banner.carousel.options.stretch,
              depth: this.banner.carousel.options.depth,
              slideShadows: false,
              modifier: this.banner.carousel.options.modifier,
            },
            on: {
              beforeInit() {
                const swiper = this;
          
                swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
                swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
          
                swiper.params.watchSlidesProgress = true;
                swiper.originalParams.watchSlidesProgress = true;
              },
              setTranslate() {
                const swiper = this;
                const {
                  width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
                } = swiper;
                const params = swiper.params.coverflowEffect;
                const isHorizontal = swiper.isHorizontal();
                const transform$$1 = swiper.translate;
                const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
                const rotate = isHorizontal ? params.rotate : -params.rotate;
                const translate = params.depth;
                // Each slide offset from center
                for (let i = 0, length = slides.length; i < length; i += 1) {
                  const $slideEl = slides.eq(i);
                  const slideSize = slidesSizesGrid[i];
                  const slideOffset = $slideEl[0].swiperSlideOffset;
                  const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
          
                   let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
                  let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
                  // var rotateZ = 0
                  let translateZ = -translate * Math.abs(offsetMultiplier);
          
                   let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
                  let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;
          
                   // Fix for ultra small values
                  if (Math.abs(translateX) < 0.001) translateX = 0;
                  if (Math.abs(translateY) < 0.001) translateY = 0;
                  if (Math.abs(translateZ) < 0.001) translateZ = 0;
                  if (Math.abs(rotateY) < 0.001) rotateY = 0;
                  if (Math.abs(rotateX) < 0.001) rotateX = 0;
          
                   const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          
                   $slideEl.transform(slideTransform);
                  $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                  if (params.slideShadows) {
                    // Set shadows
                    let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
                    let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
                    if ($shadowBeforeEl.length === 0) {
                      $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
                      $slideEl.append($shadowBeforeEl);
                    }
                    if ($shadowAfterEl.length === 0) {
                      $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
                      $slideEl.append($shadowAfterEl);
                    }
                    if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                    if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                  }
                }
          
                 // Set correct perspective for IE10
                if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
                  const ws = $wrapperEl[0].style;
                  ws.perspectiveOrigin = `${center}px 50%`;
                }
              },
              setTransition(duration) {
                const swiper = this;
                swiper.slides
                  .transition(duration)
                  .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
                  .transition(duration);
              }
            }
        };
      if(this.ionSlides) this.ionSlides.options = this.slideOpts;
  }
  
}
