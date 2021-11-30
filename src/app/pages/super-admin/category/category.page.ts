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
          console.log(this.subCategories)
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
    this.fairsService.getCurrentFair()
      .then((fair) => {
        this.subCategory.fair_id = fair.id
        this.categoryService.createSubCategory(this.subCategory)
          .then((subCategory) => {
            this.categoryService.list('all', fair).then((categories) => {
              console.log(categories.data_subcategory)
              this.categories = categories.data_category;
              this.subCategories = categories.data_subcategory;
              this.loading.dismiss();
              this.clearCategory()
              this.success = `Subcategoría creado exitosamente`;
              this.errors = null;
            });
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
      });
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
  getCategory(categoryId) {
    this.loading.present({message: 'Cargando...'});
    this.categoryService.getCategory(categoryId).then((category) => {
      console.log(category)
      this.category.id = category.data.id;
      this.category.name = category.data.name;
      this.category.type = category.data.type;
      this.category.resource.color = category.data.resources.color
      this.category.resource.url_image = category.data.resources.url_image
      this.category.fair_id = category.data.fair_id
      this.loading.dismiss();
      this.success = `Categoría consultada`;
    } ).catch(error => {
      this.loading.dismiss();
      this.errors = error;
    });
  }
  updateCategory() {
    this.loading.present({message: 'Cargando...'});
    this.categoryService.updateCategory(this.category).then((category) => {
      this.fairsService.getCurrentFair()
        .then((fair) => {
          this.categoryService.list('all', fair).then((categories) => {
            this.categories = categories.data_category;
            this.subCategories = categories.data_subcategory;
            this.loading.dismiss();
            this.success = `Categoría editada`;
            this.errors = null;
          }).catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
        });
    } ).catch(error => {
      this.loading.dismiss();
      this.errors = error;
    });
  }
}
