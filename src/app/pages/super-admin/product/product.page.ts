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
  keywords = [];
  colorList = [{'name':'negro','value':'black'},{'name':'plata','value':'silver'},{'name':'gris','value':'gray'},{'name':'blanco','value':'white'},{'name':'marron','value':'maroon'},{'name':'rojo','value':'red'},{'name':'púrpura','value':'purple'},{'name':'fucsia','value':'fuchsia'},{'name':'verde','value':'green'},{'name':'Lima','value':'lime'},{'name':'aceituna','value':'olive'},{'name':'amarillo','value':'yellow'},{'name':'Armada','value':'navy'},
    {'name':'azul','value':'blue'},{'name':'verde azulado','value':'teal'},{'name':'agua','value':'aqua'},{'name':'Alice azul','value':'aliceblue'},{'name':'blanco antiguo','value':'antiquewhite'},{'name':'aguamarina','value':'aquamarine'},
    {'name':'azur','value':'azure'},{'name':'beige','value':'beige'},{'name':'sopa de mariscos','value':'bisque'},{'name':'blanchedalmond','value':'blanchedalmond'},{'name':'Violeta Azul','value':'blueviolet'},{'name':'marrón','value':'brown'},{'name':'burlywood','value':'burlywood'},{'name':'cadete azul','value':'cadetblue'},{'name':'monasterio','value':'chartreuse'},{'name':'chocolate','value':'chocolate'},{'name':'coral','value':'coral'},{'name':'azul aciano','value':'cornflowerblue'},{'name':'seda de maiz','value':'cornsilk'},{'name':'carmesí','value':'crimson'},{'name':'cian','value':'cyan'},{'name':'azul oscuro','value':'darkblue'},{'name':'cian oscuro','value':'darkcyan'},{'name':'varilla de oro oscura','value':'darkgoldenrod'},{'name':'gris oscuro','value':'darkgray'},{'name':'verde oscuro','value':'darkgreen'},{'name':'gris oscuro','value':'darkgrey'},{'name':'caqui oscuro','value':'darkkhaki'},{'name':'darkmagenta','value':'darkmagenta'},{'name':'verde oliva oscuro','value':'darkolivegreen'},{'name':'naranja oscuro','value':'darkorange'},{'name':'orquídea oscura','value':'darkorchid'},{'name':'rojo oscuro','value':'darkred'},{'name':'salmón oscuro','value':'darksalmon'},{'name':'verde oscuro','value':'darkseagreen'},{'name':'azul oscuro','value':'darkslateblue'},{'name':'gris oscuro','value':'darkslategray'},
    {'name':'darkslategrey','value':'darkslategrey'},
    {'name':'turquesa oscuro','value':'darkturquoise'},{'name':'Violeta oscuro','value':'darkviolet'},{'name':'Rosa profundo','value':'deeppink'},{'name':'Depskyblue','value':'deepskyblue'},{'name':'dimgray','value':'dimgray'},{'name':'dimgrey','value':'dimgrey'},{'name':'dodgerblue','value':'dodgerblue'},{'name':'ladrillo refractario','value':'firebrick'},{'name':'floral blanco','value':'floralwhite'},{'name':'bosque verde','value':'forestgreen'},{'name':'Gainsboro','value':'gainsboro'},{'name':'fantasma blanco','value':'ghostwhite'},{'name':'oro','value':'gold'},{'name':'vara de oro','value':'goldenrod'},{'name':'verde amarillo','value':'greenyellow'},{'name':'gris','value':'grey'},{'name':'gotas de miel','value':'honeydew'},{'name':'Rosa caliente','value':'hotpink'},
    {'name':'indio rojo','value':'indianred'},{'name':'índigo','value':'indigo'},{'name':'Marfil','value':'ivory'},{'name':'caqui','value':'khaki'},{'name':'lavanda','value':'lavender'},{'name':'lavanda rubor','value':'lavenderblush'},{'name':'verde césped','value':'lawngreen'},{'name':'gasa de limón','value':'lemonchiffon'},{'name':'azul claro','value':'lightblue'},{'name':'coral claro','value':'lightcoral'},{'name':'cian claro','value':'lightcyan'},{'name':'dorado claro','value':'lightgoldenrodyellow'},{'name':'gris claro','value':'lightgray'},{'name':'verde claro','value':'lightgreen'},{'name':'gris claro','value':'lightgrey'},{'name':'Rosa claro','value':'lightpink'},{'name':'salmón ligero','value':'lightsalmon'},{'name':'verde claro','value':'lightseagreen'},{'name':'cielo azul claro','value':'lightskyblue'},{'name':'luces grises','value':'lightslategray'},{'name':'luces grises','value':'lightslategrey'},{'name':'azul claro','value':'lightsteelblue'},{'name':'amarillo claro','value':'lightyellow'},{'name':'verde lima','value':'limegreen'},{'name':'lino','value':'linen'},{'name':'magenta','value':'magenta'},{'name':'mediumaquamarine','value':'mediumaquamarine'},{'name':'azul medio','value':'mediumblue'},{'name':'orquídea mediana','value':'mediumorchid'},{'name':'mediumpurple','value':'mediumpurple'},{'name':'medio verde','value':'mediumseagreen'},
    {'name':'medio pizarra azul','value':'mediumslateblue'},{'name':'medio primaveral','value':'mediumspringgreen'},{'name':'medio turquesa','value':'mediumturquoise'},{'name':'medio violeta','value':'mediumvioletred'},{'name':'medianoche azul','value':'midnightblue'},
    {'name':'crema de menta','value':'mintcream'},{'name':'mistyrose','value':'mistyrose'},{'name':'mocasín','value':'moccasin'},{'name':'navajowhite','value':'navajowhite'},{'name':'Oldlace','value':'oldlace'},{'name':'verde oliva','value':'olivedrab'},{'name':'naranja','value':'orange'},{'name':'rojo naranja','value':'orangered'},{'name':'orquídea','value':'orchid'},{'name':'varilla de oro pálido','value':'palegoldenrod'},{'name':'Verde pálido','value':'palegreen'},{'name':'paleturquesa','value':'paleturquoise'},{'name':'pálido violeta','value':'palevioletred'},{'name':'papaya','value':'papayawhip'},{'name':'melocotón','value':'peachpuff'},{'name':'Perú','value':'peru'},{'name':'rosado','value':'pink'},{'name':'ciruela','value':'plum'},{'name':'azul pálido','value':'powderblue'},{'name':'rojo','value':'red'},{'name':'marron rosado','value':'rosybrown'},{'name':'azul real','value':'royalblue'},{'name':'silla de montar','value':'saddlebrown'},{'name':'salmón','value':'salmon'},{'name':'marrón arenoso','value':'sandybrown'},{'name':'Mar verde','value':'seagreen'},{'name':'concha','value':'seashell'},{'name':'tierra de siena','value':'sienna'},{'name':'cielo azul','value':'skyblue'},{'name':'pizarra azul','value':'slateblue'},{'name':'gris pizarra','value':'slategray'},{'name':'pizarra gris','value':'slategrey'},{'name':'nieve','value':'snow'},{'name':'primavera verde','value':'springgreen'},{'name':'azul acero','value':'steelblue'},{'name':'broncearse','value':'tan'},{'name':'cardo','value':'thistle'},{'name':'tomate','value':'tomato'},{'name':'turquesa','value':'turquoise'},{'name':'Violeta','value':'violet'},{'name':'trigo','value':'wheat'},{'name':'humo blanco','value':'whitesmoke'},{'name':'amarillo verde','value':'yellowgreen'}
  ];
   
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
					for(let word of this.product.resources.keywords) {
                       this.keywords.push({'value':word});
					}
                    
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
		this.keywords.forEach((keyword)=>{
			this.product.resources.keywords.push(product.keyword.value);
		});
		
        let product = clone(this.product);
		
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
     this.keywords.push({'value':this.newKeyWord.value});
     this.newKeyWord = null;
     this.editSave = true;
   }
  }

  openColors(attribute){
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
