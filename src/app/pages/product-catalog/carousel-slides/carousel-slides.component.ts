import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-carousel-slides',
  templateUrl: './carousel-slides.component.html',
  styleUrls: ['./carousel-slides.component.scss'],
})
export class CarouselSlidesComponent implements OnInit {

  @ViewChild('slides', { static: false }) slides: IonSlides;
  
  
  _factorWidth = 0.9;
  @Input() product: any;
  @Input() resize: any;
  @Input() imagesPriceWidth: any;
  @Input() imageWidth: any;
  @Input() imageHeight: any;
  @Output() changePrice = new EventEmitter<string>();
  colors = [];
  imagesArray = [];
  imageSelected = null;
  colorSelected = null;
  slideOpts : any;
  constructor() { }
  isBeginning = true;
  isEnd = false;

  ngOnInit() {
     this.onResize();
     this.product.prices.forEach((price)=>{
         if(price.resources && price.resources.attributes && price.resources.attributes.length > 0 && price.resources.attributes[0].value && price.resources.attributes[0].value.length > 0 ) {
           this.colors.push({'value': price.resources.attributes[0].value, 'image': price.resources.images});
         }
     });
     
     setTimeout(()=>{

         //this.slides = <IonSlides>document.getElementById("slides");
         
         if(this.colors.length >= 1) {
            this.onChangeColor(1);
            this.onChangeColor(0);
            //this.simpleSlideOpts();
         }
         else {
            this.onChangeColor(0)
            //this.simpleSlideOpts();
         }
         if(this.product.priceSelectedIndex) {
           this.onChangeColor(this.product.priceSelectedIndex);
         }
     },50);
     
     
    //this.coverflowSlideOpts();
    
     //this.cubeSlideOpts();
     //this.fadeSlideOpts();
  }
  
  simpleSlideOpts() {
     this.slideOpts = {
        initialSlide: 0,
        speed: 400,
        navigation: true
     };
  }
  
  cubeSlideOpts() {
      this.slideOpts = {
          grabCursor: true,
          cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          },
          on: {
            beforeInit: function() {
              const swiper = this;
              swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
              swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

              const overwriteParams = {
                slidesPerView: 1,
                slidesPerColumn: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: true,
                resistanceRatio: 0,
                spaceBetween: 0,
                centeredSlides: false,
                virtualTranslate: true,
              };

              this.params = Object.assign(this.params, overwriteParams);
              this.originalParams = Object.assign(this.originalParams, overwriteParams);
            },
            setTranslate: function() {
              const swiper = this;
              const {
                $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
              } = swiper;
              const params = swiper.params.cubeEffect;
              const isHorizontal = swiper.isHorizontal();
              const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
              let wrapperRotate = 0;
              let $cubeShadowEl;
              if (params.shadow) {
                if (isHorizontal) {
                  $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
                  if ($cubeShadowEl.length === 0) {
                    $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
                    $wrapperEl.append($cubeShadowEl);
                  }
                  $cubeShadowEl.css({ height: `${swiperWidth}px` });
                } else {
                  $cubeShadowEl = $el.find('.swiper-cube-shadow');
                  if ($cubeShadowEl.length === 0) {
                    $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
                    $el.append($cubeShadowEl);
                  }
                }
              }

              for (let i = 0; i < slides.length; i += 1) {
                const $slideEl = slides.eq(i);
                let slideIndex = i;
                if (isVirtual) {
                  slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
                }
                let slideAngle = slideIndex * 90;
                let round = Math.floor(slideAngle / 360);
                if (rtl) {
                  slideAngle = -slideAngle;
                  round = Math.floor(-slideAngle / 360);
                }
                const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
                let tx = 0;
                let ty = 0;
                let tz = 0;
                if (slideIndex % 4 === 0) {
                  tx = -round * 4 * swiperSize;
                  tz = 0;
                } else if ((slideIndex - 1) % 4 === 0) {
                  tx = 0;
                  tz = -round * 4 * swiperSize;
                } else if ((slideIndex - 2) % 4 === 0) {
                  tx = swiperSize + (round * 4 * swiperSize);
                  tz = swiperSize;
                } else if ((slideIndex - 3) % 4 === 0) {
                  tx = -swiperSize;
                  tz = (3 * swiperSize) + (swiperSize * 4 * round);
                }
                if (rtl) {
                  tx = -tx;
                }

                 if (!isHorizontal) {
                  ty = tx;
                  tx = 0;
                }

                 const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
                if (progress <= 1 && progress > -1) {
                  wrapperRotate = (slideIndex * 90) + (progress * 90);
                  if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
                }
                $slideEl.transform(transform$$1);
                if (params.slideShadows) {
                  // Set shadows
                  let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
                  let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
                  if (shadowBefore.length === 0) {
                    shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
                    $slideEl.append(shadowBefore);
                  }
                  if (shadowAfter.length === 0) {
                    shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
                    $slideEl.append(shadowAfter);
                  }
                  if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                  if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                }
              }
              $wrapperEl.css({
                '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
                '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
                '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
                'transform-origin': `50% 50% -${swiperSize / 2}px`,
              });

               if (params.shadow) {
                if (isHorizontal) {
                  $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
                } else {
                  const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
                  const multiplier = 1.5 - (
                    (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
                    + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
                  );
                  const scale1 = params.shadowScale;
                  const scale2 = params.shadowScale / multiplier;
                  const offset$$1 = params.shadowOffset;
                  $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
                }
              }

              const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
              $wrapperEl
                .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
            },
            setTransition: function(duration) {
              const swiper = this;
              const { $el, slides } = swiper;
              slides
                .transition(duration)
                .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
                .transition(duration);
              if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
                $el.find('.swiper-cube-shadow').transition(duration);
              }
            },
          }
        }
  }
  fadeSlideOpts() {
    this.slideOpts = {
      on: {
        beforeInit() {
          const swiper = this;
          swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
          const overwriteParams = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            spaceBetween: 0,
            virtualTranslate: true,
          };
          swiper.params = Object.assign(swiper.params, overwriteParams);
          swiper.params = Object.assign(swiper.originalParams, overwriteParams);
        },
        setTranslate() {
          const swiper = this;
          const { slides } = swiper;
          for (let i = 0; i < slides.length; i += 1) {
            const $slideEl = swiper.slides.eq(i);
            const offset$$1 = $slideEl[0].swiperSlideOffset;
            let tx = -offset$$1;
            if (!swiper.params.virtualTranslate) tx -= swiper.translate;
            let ty = 0;
            if (!swiper.isHorizontal()) {
              ty = tx;
              tx = 0;
            }
            const slideOpacity = swiper.params.fadeEffect.crossFade
              ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
              : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
            $slideEl
              .css({
                opacity: slideOpacity,
              })
              .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
          }
        },
        setTransition(duration) {
          const swiper = this;
          const { slides, $wrapperEl } = swiper;
          slides.transition(duration);
          if (swiper.params.virtualTranslate && duration !== 0) {
            let eventTriggered = false;
            slides.transitionEnd(() => {
              if (eventTriggered) return;
              if (!swiper || swiper.destroyed) return;
              eventTriggered = true;
              swiper.animating = false;
              const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
              for (let i = 0; i < triggerEvents.length; i += 1) {
                $wrapperEl.trigger(triggerEvents[i]);
              }
            });
          }
        },
      }
    }  
      
  }
  coverflowSlideOpts() {
      this.slideOpts = {
          slidesPerView: 3,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
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
      }
    }
    
  onChangeColor(index) {
     this.imageSelected = index;
     if(this.product.prices[index]) {
       this.imagesArray = this.product.prices[index].resources.images; 
       this.product.priceSelected = this.product.prices[index];
       this.product.priceSelectedIndex = index;
       if(this.changePrice) {
         this.changePrice.emit();
       }
     }
  }    

  slidePrev() {
    this.slides.slidePrev();
  }
  
  slideNext() {
    this.slides.slideNext();
  }

  ionSlideChange(eve) {
    if(this.slides) {
      this.slides.isBeginning().then((isbeg)=>{
        this.isBeginning = isbeg;
      });
    
      this.slides.isEnd().then((isE)=>{
        this.isEnd = isE;
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(this.resize)
    this._factorWidth = window.innerWidth <= 500 ? 4 : window.innerWidth < 670 ? 4.5 : 5.9;
    
  }


}

