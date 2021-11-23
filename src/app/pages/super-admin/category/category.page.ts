import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { AlertController, ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  errors: any = null;
  success: string = null;
  showFormCategory: any = true;
  showFormSubCategory: any = false;
  category: any;
  subCategory: any;
  constructor(
    private routeActivated: ActivatedRoute,
    private router: Router,
    private loading: LoadingService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController
  ) {
  }

  ngOnInit() {
    this.category = {
      type: '',
      name: '',
      resource: {
        color: '',
        url_image: ''
      }
    };
    this.subCategory = {
      category_id: '',
      type: '',
      name: '',
      resource: {
        color: '',
        url_image: ''
      }
    };
  }
  storeCategory() {
    this.loading.present({message: 'Cargando...'});
    console.log(this.category);
  }
  storeSubCategory() {
    this.loading.present({message: 'Cargando...'});
    console.log(this.subCategory);
  }
}
