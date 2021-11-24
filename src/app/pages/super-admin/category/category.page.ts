import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { AlertController, ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import {CategoryService} from './../../../api/category.service';
import { FairsService } from './../../../api/fairs.service';

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
  categories: any;
  subCategories: any;
  constructor(
    private routeActivated: ActivatedRoute,
    private router: Router,
    private loading: LoadingService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private categoryService: CategoryService,
    private fairsService: FairsService,
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
    this.loading.present({message: 'Cargando...'});
    this.fairsService.getCurrentFair()
      .then((fair) => {
        this.categoryService.list('all', fair).then((categories) => {
          this.categories = categories.data_category;
          this.subCategories = categories.data_subcategory;
          this.loading.dismiss();
          this.errors = null;
        }).catch(error => {
          this.loading.dismiss();
          this.errors = error;
        });
      });

  }
  storeCategory() {
    this.loading.present({message: 'Cargando...'});
    this.fairsService.getCurrentFair()
      .then((fair) => {
        this.category.fair_id = fair.id
        this.categoryService.createCategory(this.category)
          .then((category) => {
            this.categoryService.list('all', fair).then((categories) => {
              this.categories = categories.data_category;
              this.subCategories = categories.data_subcategory;
              this.loading.dismiss();
              this.clearCategory()
              this.success = `Categoría creado exitosamente`;
              this.errors = null;
            });
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
      });
  }
  storeSubCategory() {
    this.loading.present({message: 'Cargando...'});
    console.log(this.subCategory);
  }
  clearCategory() {
    this.category = {
      type: '',
      name: '',
      resource: {
        color: '',
        url_image: ''
      }
    };
  }
}
