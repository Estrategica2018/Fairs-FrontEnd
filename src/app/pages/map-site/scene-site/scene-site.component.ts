
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HostListener } from "@angular/core";
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-scene-site',
  templateUrl: './scene-site.component.html',
  styleUrls: ['./scene-site.component.scss'],
})
export class SceneSiteComponent implements OnInit {

  constructor(private animationCtrl: AnimationController,) { }

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
  layoutBannerSelectTime = 0;

  ngOnInit() {

  }

  goToOnHoverBanner(banner, col, row, scene) {
    if (banner && this.editMode) {
      this.layoutBannerSelectTime = Date.now();
      this.onHoverBanner.emit({ 'banner': banner, 'col': col, 'row': row, 'scene': scene });
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
}
