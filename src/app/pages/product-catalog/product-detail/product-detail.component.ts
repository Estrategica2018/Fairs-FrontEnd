import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AlertController, ActionSheetController, ModalController  } from '@ionic/angular';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { AdminProductsService } from './../../../api/admin/products.service';
import { LoadingService } from './../../../providers/loading.service';
import { ToastController } from '@ionic/angular';
import { UsersService } from '../../../api/users.service';
import { ShoppingCartsService } from '../../../api/shopping-carts.service';
import { Router } from '@angular/router';
import { processData, clone } from '../../../providers/process-data';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {

  @Input() fair: any;
  @Input() pavilionId: any;
  @Input() standId: any;
  @Input() product: any;
  @Input() _parent: any;
  @ViewChild('carouselSlides', { static: true }) carouselSlides: any;
  priceSelected: any;
  userDataSession: any;
  lockHover: any;
  profileRole: any = null;
  amount = 1;
  attributes = [];
  showConfirmByProduct = false;
  showRegister = false;
  otherGroup = [];
  
  
  constructor(
    private alertCtrl: AlertController,
    private actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer,
    private adminProductsService: AdminProductsService,
    private loading: LoadingService,
    private toastCtrl: ToastController,
    private usersService: UsersService,
    private shoppingCartsService: ShoppingCartsService,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    
    this.product = clone(this.product);
    
    if(this.product.resources && this.product.resources.attributes && this.product.resources.attributes.length > 0) {
        
        this.product.attributeSelect = this.product.attributeSelect || [];
        this.product.resources = this.product.resources || { 'detail': { 'elements': [] } };
        
        for(let attr of this.product.resources.attributes) {
          if(attr.value.split('|').length>1) {
            let list = [];
            attr.value.split('|').forEach((item)=>{
              list.push(item);
            });
            
            if(attr.name === 'Color') {
               if(attr.value.length > 0) {
                list.push(attr.value);
                this.product.attributeSelect.push({list: list, label:attr.name});
               }
            }
            else {
              this.product.attributeSelect.push({list: list, label:attr.name});
            }
          }
        }
    }    
    
    this.changePrice();
    let index = 0;
    
    this.product.prices.forEach((price)=>{
      let i = 0;
      let mbFlag = null;
      if(price.resources && price.resources.attributes && price.resources.attributes.length > 0) { 
        price.attributeSelect = price.attributeSelect || [];
        for(let attr of price.resources.attributes) {
          if(attr.value.split('|').length>1) {
            let list = [];
            attr.value.split('|').forEach((item)=>{
              list.push(item);
            });
            price.attributeSelect.push({list: list, label:attr.name})
          }
          i++;
        }
      }
      index ++;
    }); 
    
    this.usersService.getUser().then((userDataSession: any)=>{
      this.userDataSession = userDataSession;
      if(userDataSession && userDataSession.user_roles_fair)  {
        this.profileRole = {};
        userDataSession.user_roles_fair.forEach((role)=>{
            if(role.id == 1) { //"super_administrador"
               this.profileRole.admin = true;
            }
         });
         
      }
    });
    
    if(this.product.resources.detail && this.product.resources.detail.elements) {
      this.product.resources.detail.elements.forEach((item)=>{
        if(item.video) { 
            const sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(item.video.videoUrl);
            item.video.sanitizer = sanitizer;
          }
      })
    }
  }

  async onAddImg(){
    
    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa la ruta de la imágen",
      inputs: [
        {
          name: 'url',
          value: 'https://dummyimage.com/225x105/EFEFEF/000.png',
          placeholder: 'Url'
        },
        {
          name: 'title',
          value: 'Título de imágen'
        },
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Agregar', 
         role: 'destructive', 
         handler: (data) => {
           if(!this.product.resources.detail || !this.product.resources.detail.elements) {
              this.product.resources.detail = { 'elements': [] };
           }
           
           this.product.resources.detail.elements.push({'url':data.url,'title':data.title});
           this.saveProduct('Agregar imágen');
         }
        }]
    });
    await actionAlert.present();
  }  
  
  async onAddVideo(){
    
    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa la ruta del video",
      inputs: [
        {
          name: 'videoUrl',
          value: 'https://player.vimeo.com/video/286898202',
          placeholder: 'Url Video'
        },
        {
          name: 'title',
          value: 'Título del video'
        },
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Agregar', 
         role: 'destructive', 
         handler: (data) => {
          
          if(!this.product.resources.detail || !this.product.resources.detail.elements) {
            this.product.resources.detail = { 'elements': [] };
          }
           
          const sanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(data.videoUrl);
          this.product.resources.detail.elements.push({'video':{'videoUrl':data.videoUrl,'sanitizer': sanitizer},'title':data.title});
          this.saveProduct('Agregar video');
         }
        }]
    });
    await actionAlert.present();
  } 

  async onAddParagraph(){
    
    const actionAlert = await this.alertCtrl.create({
      message: "Ingresa el Párrafo",
      inputs: [
        {
          type: 'textarea',
          name: 'paragraph',
          placeholder: 'Párrafo'
        }
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Agregar', 
         role: 'destructive', 
         handler: (data) => {
          
          if(!this.product.resources.detail || !this.product.resources.detail.elements) {
            this.product.resources.detail = { 'elements': [] };
          }
           
          this.product.resources.detail.elements.push({'paragraph':data.paragraph});
          this.saveProduct('Agregar Párrafo');
         }
        }]
    });
    await actionAlert.present();
  }  


  async presentActionAdd() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tipo de elemento a agregar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Imágen',
        role: 'destructive',
        icon: 'image-outline',
        handler: () => {
          this.onAddImg();
        }
      }, {
        text: 'Video',
        icon: 'albums-outline',
        handler: () => {
          this.onAddVideo();
        }
      }, {
        text: 'Parrafo',
        icon: 'browsers-outline',
        handler: () => {
          this.onAddParagraph();
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    
  }
  
  onDeleteItemAdded(index){
     this.product.resources.detail.elements = this.product.resources.detail.elements.filter((item, ind)=>{
        return ind != index;
     });
     this.saveProduct('Borrar elemento');
  }
  
  saveProduct(action) {
      
    this.loading.present({message:'Cargando...'});
    this.adminProductsService.update(Object.assign({'fair_id':this.fair.id,'pavilion_id':this.pavilionId,'stand_id':this.standId},this.product))
    .then((product) => {
      
      //window.location.replace(`${this.url}/#/super-admin/map-editor/product/${this.pavilion.id}/${this.standId}/${this.product.id}/${this.sceneId}`);
      //this.router.navigateByUrl(`/super-admin/map-editor/product/${this.pavilion.id}/${this.stand.id}/${this.product.id}/${this.sceneId}`);
       this.presentToast('Acción '+action+' exitosa', 'app-success-alert');
       this.loading.dismiss(); 
    })
    .catch(error => {
       this.loading.dismiss(); 
       this.presentToast('Acción '+action+' generó error', 'app-error-alert');
       //this.errors = `Consultando el servicio para actualizar producto ${error}`;
    });
  }

  async presentToast(msg,cssClass) {
    const toast = await this.toastCtrl.create({
      message: msg,
      cssClass: cssClass,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  changeOtherPrice(othGroup){
    this.product.priceSelected = othGroup.priceSelected;
    this.changePrice();
    this.carouselSlides.onChangeColor(othGroup.index);
  }
  
  changePrice(){
    this.priceSelected = this.product.priceSelected;
    this.attributes = [];
    let value;
    let mbControl = false;
    
    if(this.priceSelected && this.priceSelected.resources && this.priceSelected.resources.attributes && this.priceSelected.resources.attributes.length > 0) {
        for(let attr of this.priceSelected.resources.attributes) {
           mbControl = false;
           value = this.priceSelected.resources.attributes[attr];
           for(let attrTem of this.attributes) { 
             
             if(attrTem.name === attr.name) {
                mbControl = true;
                //attrTem.value = value.value + ( value.formatSelect ? ' ' + value.formatSelect : '' );
             }
           }
           if(!mbControl) {
              if(attr.name === 'Color'){
                if(attr.label) {
                    this.attributes.push({'name':attr.name, 'value': attr.label});
                }
              }
              else {
                 this.attributes.push({'name':attr.name, 'value': attr.value});
              }
           }
        }
    }
     
    if(this.product && this.product.resources && this.product.resources.attributes && this.product.resources.attributes.length > 0) {
      for(let attr of this.product.resources.attributes) {
        if(attr.value.length > 0) {
          this.attributes.push({'name':( attr.name || attr.key ), 'value': attr.value});
        }
      }
    }
  }
  
  confirmBuyProduct(product) {
      
      if(this.userDataSession) {
          
        if(!this.hasEmptyAttributes(this.priceSelected.attributeSelect) && 
          !this.hasEmptyAttributes(product.attributeSelect)) {
            this.showConfirmByProduct = true;
            this.showRegister = false;
        }
      }
      else {
        this.showConfirmByProduct = false;
        this.showRegister = true;  
      }
  }
  
  onBuyProduct(product) {
        this.loading.present({message:'Cargando...'});
        this.shoppingCartsService.addShoppingCart(this.fair, this.product, this.priceSelected, null, this.amount, this.userDataSession )
        .then((response) => {
          this.loading.dismiss();
          this.modalCtrl.dismiss();
          this.showConfirmByProduct = false;
          this.presentToast('Producto agredado exitósamente al carrito de compras', 'app-success-alert');
          if(this._parent && this._parent.openShoppingCart) this._parent.openShoppingCart(this.priceSelected);
        })
        .catch(error => {
          this.loading.dismiss(); 
          this.presentToast('Ocurrió un error al agregar al carrito de compras: ['+ error +']', 'app-error-alert');
        });
  }
  
  hasEmptyAttributes(attributeSelect) {
   if(attributeSelect && attributeSelect.length > 0)
   for(let attr of attributeSelect) {
       if(attr.list && !attr.selected) {
         attr.error = true;
         this.presentToast('Debe seleccionar un valor para el atributo ' + attr.label, 'app-error-alert');
         return true;
       } else {attr.error = false;}
   }
   
   return false;
  }
  
  onBuyProductAndClose(product) {
      
      this.loading.present({message:'Cargando...'});
      this.shoppingCartsService.addShoppingCart(this.fair, this.product, this.priceSelected, null, this.amount, this.userDataSession )
      .then((response) => {
        this.loading.dismiss();
        this.showConfirmByProduct = false;
        this.presentToast('Producto agredado exitósamente al carrito de compras', 'app-success-alert');
      })
      .catch(error => {
        this.loading.dismiss(); 
        this.presentToast('Ocurrió un error al agregar al carrito de compras: ['+ error +']', 'app-error-alert');
      });
  }
  
  closeModal() {
      this.modalCtrl.dismiss();
  }
  
  onLogin() {
    //this.modalCtrl.dismiss();
    //this.redirectTo('/login');
    if(this._parent.presenterLogin ) { 
      this._parent.presenterLogin(); 
    }
    
  }
  
  redirectTo(uri:string){
    this.router.navigateByUrl('/overflow', {skipLocationChange: true}).then(()=>{
      this.router.navigate([uri])
    });
  }

}