import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { FairsService } from './../../../api/fairs.service';
import { ProductsService } from './../../../api/products.service';
import { PavilionsService } from './../../../api/pavilions.service';
import { CategoryService } from './../../../api/category.service';
import { StandsService } from './../../../api/stands.service';
import { AdminProductsService } from './../../../api/admin/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { clone } from '../../../providers/process-data';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  
  fair: any;
  pavilion: any;
  stand: any;
  product: any;
  productId: any;
  errors: string = null;
  success: string = null;
  editSave = false;
  productPriceSel = null;
  categories: any;
  newAttr = null;
  newKeyWord = null;
  indexEditAttr = null;
  attributeSel = null;
  showColor = null;
   
  attributes = [
    {'type':'color','name':'color','label':'Color','format':''},
    {'type':'number','name':'width','label':'Ancho','format':['cm','mtrs','pulg']},
    {'type':'number','name':'height','label':'Alto','format':['cm','mtrs','pulg']},
    {'type':'text','name':'material','label':'Material','format':['madera','vidrio','poliester', 'fibra de vidrio']},
    {'type':'text','name':'weigth','label':'Peso','format':['gramos','kilogramos','litros','mililitros']},
  ];
  
  constructor(
    private adminProductsService: AdminProductsService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private alertCtrl: AlertController,
    private fairsService: FairsService,
    private pavilionsService: PavilionsService,
    private standsService: StandsService,
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private router: Router
    ) { }

  ngDoCheck(){
    document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }
  
  ngOnInit() {
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.loading.present({message:'Cargando...'});
    this.errors = null;
    
    this.fairsService.getCurrentFair()
      .then((fair) => {
            this.fair = fair;
            this.categoryService.list('ProductCategory',this.fair)
            .then(({data}) => {
              this.categories = data;
              
              this.fair.pavilions.forEach((pavilion)=>{
                if(pavilion.id == pavilionId ) {
                    this.pavilion = pavilion;
                    for(let stand of this.pavilion.stands) {
                      if(Number(stand.id)  === Number(standId)) { 
                        this.stand = stand;
                        break;
                      }
                    }
                }
              });
              if(this.productId) {
                this.productsService.get(this.fair.id,this.pavilion.id,this.stand.id, this.productId)
                .then((products) => {
                    this.loading.dismiss();
                    this.product = products[0];
                    this.product.url_imagen = this.product.prices[0].resources.images[0].url_image;
                    this.product.resources = this.product.resources || {};
                    if(typeof this.product.resources.attributes !== 'object' || !this.product.resources.attributes.length ) {
                       this.product.resources.attributes = [];
                    }
                    this.product.resources.keywords = this.product.resources.keywords || [];
                    
                  })
                  .catch(error => {
                     this.loading.dismiss();
                     this.errors = error;
                  });
               }
               else {
                 this.productsService.get(this.fair.id,this.pavilion.id,this.stand.id, this.productId)
                .then((products) => {
                    let id = products && products.length ? products.length + 1 : 1;
                    this.product = { 'name': 'Producto #' + id , 'description':  'Descripción producto #' + id}
                    this.product.resources = { 'attributes': [], 'keywords':[] };
                    
                    this.editSave = true;
                    this.loading.dismiss();
                  })
                  .catch(error => {
                     this.loading.dismiss();
                     this.errors = error;
                  });
               }
               
            })
            .catch(error => {
               this.loading.dismiss();
               this.errors = error;
            });
      });
  }
  
  updateProduct(){
    this.loading.present({message:'Cargando...'});
    if(this.product.id) {
        const product = clone(this.product);
        this.adminProductsService.update(Object.assign({'fair_id':this.fair.id,'pavilion_id':this.pavilion.id,'stand_id':this.stand.id},product))
       .then((product) => {
          this.loading.dismiss();
          this.errors = null;
          this.success = `Producto modificado exitosamente`;
          //this.fairsService.refreshCurrentFair();
          //this.pavilionsService.refreshCurrentPavilion();
          //this.redirectTo(`/super-admin/product/${this.pavilion.id}/${this.stand.id}/${product.id}`);
      })
      .catch(error => {
        this.loading.dismiss();
        this.errors = error;
      });
    }
    else {
      
      this.adminProductsService.create(Object.assign({'fair_id':this.fair.id,'pavilion_id':this.pavilion.id,'stand_id':this.stand.id},this.product))
       .then((product) => {
          this.loading.dismiss();
          this.errors = null;
          this.success = `Producto creado exitosamente`;
          this.fairsService.refreshCurrentFair();
          this.pavilionsService.refreshCurrentPavilion();
          this.redirectTo(`/super-admin/product/${this.pavilion.id}/${this.stand.id}/${product.id}`);
      })
      .catch(error => {
         this.loading.dismiss();
         this.errors = error;
      });
    }
  }
  
  async deleteProduct() {
    
      const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Borrar producto?',
      subHeader: 'Confirma para borrar el producto',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: (data) => {
            this.adminProductsService.delete(this.product)
              .then((response) => {
                   this.success = `Producto borrado exitosamente`;
                   this.redirectTo(`/super-admin/stand/${this.pavilion.id}/${this.stand.id}`);
                
              },
              (error) => {
                  this.errors = error;
             })
            .catch(error => {
                this.errors = error; 
             });        

          }
        }
      ]
    });
    await alert.present();
  }
  
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }
  
  addAttribute(){
    if(this.newAttr.name.length > 0 && this.newAttr.value.length > 0) {
      this.product.resources.attributes.push(this.newAttr);
      this.newAttr = null;
      this.editSave = true;
    }
  }
  
  deleteAttr(index) {
    this.product.resources.attributes = this.product.resources.attributes.filter((attr, ind)=>{
        return ind != index;
    });
    this.editSave = true;
  }
  
  showModifyAttr(i) {
    this.indexEditAttr = i;
  }
  
  modifyAttr(i) {
    this.indexEditAttr = null;
  }
  

  addKeyWord(){
   if(this.newKeyWord.value.length > 0 ) {
     this.product.resources.keywords.push(this.newKeyWord.value);
     this.newKeyWord = null;
     this.editSave = true;
   }
  }

  openColors (attribute){
      this.attributeSel = attribute;
      this.showColor = true;
  }
  
  setColor (color){
      this.attributeSel.value = color.value;
      this.showColor = false;
      this.editSave = true;
  }  
  
  onToBack() {
     window.history.back();
  }
  
  async presentActionPrice() {
    const actionSheet = await this.alertCtrl.create({
      header: 'Precio del producto',
      message: "Ingresa el precio del producto",
      inputs: [
        {
          name: 'price',
          value: this.product.price,
          placeholder: '$ Precio'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.product.price = data.price;
            this.editSave = true;
          }
        }
      ]
    });
    await actionSheet.present();

  }

}
