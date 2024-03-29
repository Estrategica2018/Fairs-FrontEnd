
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { HostListener } from "@angular/core";
import { Router } from '@angular/router';
import { Animation, AnimationController, ModalController } from '@ionic/angular';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-scene-site',
  templateUrl: './scene-site.component.html',
  styleUrls: ['./scene-site.component.scss'],
})
export class SceneSiteComponent implements OnInit {

  constructor(private animationCtrl: AnimationController,private modalCtrl: ModalController,) { }

  @Input() scene: any;
  @Input() level: any;
  @Input() windowScreenSm: boolean;
  @Input() windowScreenLg: boolean;
  @Input() editMode: boolean = false;
  @Input() layoutColSel: any;
  @Input() router: Router;
  @Input() bannerSelectHover: any;
  @Input() layoutColHover: any;
  @Output() onHoverBanner = new EventEmitter<any>();
  @Output() selectLayout = new EventEmitter<any>();
  modal: any;

  layoutBannerSelectTime = 0;
  showSpeakerCatalogActions = '';
  showProductCatalogActions = '';
  tabSelect = '';
  bannerSpeakerSelectHover: any;
  isHover: any;
  @ViewChild('iFrame', { static: true }) iFrameElement: ElementRef;

  ngOnInit() {
    
  }

  goToOnHoverBanner(banner, col, row, scene) {

    this.showSpeakerCatalogActions = null;

    console.log(this.iFrameElement);

    if (banner && this.editMode) {
      this.layoutBannerSelectTime = Date.now();
      this.onHoverBanner.emit({ 'banner': banner, 'col': col, 'row': row, 'scene': scene });
    }
    else if (banner.formCatalog) {
      this.redirectTo('/form-mincultura-catalog');
    }
    else if (banner.speakerCatalog) {
      alert('conferncista');
    }
    else if (banner && banner.externalUrl) {
      const windowReference = window.open();
      windowReference.location.href = banner.externalUrl;
    } else if (banner.internalUrl) {
      this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
        this.router.navigate([banner.internalUrl])
      });
    }
    
  }

  goToSelectLayout(col, row, scene) {
    if (this.editMode && (Date.now() - this.layoutBannerSelectTime) > 100) {
      this.layoutBannerSelectTime = Date.now();
      this.onHoverBanner.emit({ 'banner': null, 'col': col, 'row': row, 'scene': scene });
    }
  }

  goToOnHoverBannerReciclyer($event) {

    this.goToOnHoverBanner($event.banner, $event.col, $event.row, $event.scene);
  }

  layoutColSelect($event) {
    this.selectLayout.emit($event);
  }

  async startAnimation(obj) {

    if (!obj.hoverEffects) return;

    if (obj.hoverEffects.includes('GirarDerecha')) {
      const squareA = this.animationCtrl.create()
        .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))

        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'rotate(0)' },
          { offset: 0.5, transform: 'rotate(45deg)' },
          { offset: 1, transform: 'rotate(0) ' }
        ]);
      await squareA.play();
    }
    if (obj.hoverEffects.includes('GirarIzquierda')) {
      const squareA = this.animationCtrl.create()
        .addElement(document.querySelector<HTMLElement>('#obj-' + obj.id))

        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'rotate(0)' },
          { offset: 0.5, transform: 'rotate(-45deg)' },
          { offset: 1, transform: 'rotate(0) ' }
        ]);
      await squareA.play();
    }
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  ngOnDestroy(): void {
    if (this.modal) { this.modal.dismiss(); }
  }

  closeModal() {
    if (this.modal) { this.modal.dismiss(); }
  }

  async onPresenterLogin() {

    this.closeModal();

    this.modal = await this.modalCtrl.create({
      component: LoginComponent,
      cssClass: 'boder-radius-modal',
      componentProps: {
        '_parent': this
      }
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();

    if (data) {
    }
  }
}
