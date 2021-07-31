import { Component, OnInit } from '@angular/core';
import { LoadingService } from './../../../providers/loading.service';
import { FairsService } from './../../../api/fairs.service';
import { StandsService } from './../../../api/stands.service';
import { MerchantsService } from './../../../api/merchants.service';
import { AdminStandsService } from './../../../api/admin/stands.service';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-stand',
  templateUrl: './stand.page.html',
  styleUrls: ['./stand.page.scss'],
})
export class StandPage implements OnInit {

  stand: any;
  editSave: any;
  pavilion: any;
  merchants: any;
  merchant: any;
  fair = null;
  errors: string = null;
  
  constructor(
    private standsService: StandsService,
    private adminStandsService: AdminStandsService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private fairsService: FairsService,
    private merchantsService: MerchantsService,
    private actionSheetController: ActionSheetController
    ) { }

  ngOnInit() {
    const pavilionId = this.route.snapshot.paramMap.get('pavilionId');
    const standId = this.route.snapshot.paramMap.get('standId');
    this.loading.present({message:'Cargando...'});
    this.fairsService.getCurrentFair()
      .then((fair) => {
          this.fair = fair;
          this.fair.pavilions.forEach((pavilion)=>{
              if(pavilion.id == pavilionId ) {
                 this.pavilion = pavilion;
              }
          })
          
          this.merchantsService.list()
          .then((merchants) => {
              this.merchants = merchants;
              
              if(standId) {
                  this.standsService.get(pavilionId,standId)
                   .then((stand) => {
                      this.loading.dismiss();
                      this.errors = null;
                      this.stand = stand;
                      if(this.stand.merchant) {
                        this.merchant = this.stand.merchant;
                        this.stand.merchant_id = this.stand.merchant.id;
                      }
                  })
                  .catch(error => {
                     this.loading.dismiss();
                     this.errors = error;
                  });
                }
                else {
                    this.stand = { 
                                 'nick':' #Nuevo Local Comercial',
                                 'name': 'Descripción local comercial',
                                 'resources':  [{
                                     'url_image':'https://dummyimage.com/1092x768/EFEFEF/000.png'
                                 }] };
                    this.loading.dismiss();
                }
              
          })
          .catch(error => {
             this.errors = error;
          });
      })
      .catch(error => {
         this.errors = error;
      });
      
    
  }
  
  updateStand() {
      this.loading.present({message:'Cargando...'});
      this.stand.pavilion_id = this.pavilion.id;
      this.stand.merchant_id = this.merchant.id;
      if(this.stand.id) {
          this.adminStandsService.update(this.stand)
          .then((stand) => {
             this.loading.dismiss();
             this.errors = null;
             this.stand = stand;
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
      }
      else {
          this.stand.stand_type_id = 1;
          this.adminStandsService.create(this.stand)
          .then((stand) => {
             this.loading.dismiss();
             this.errors = null;
             this.stand = stand;
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
      }
  }
  
  deleteStand() {
      this.adminStandsService.delete(this.stand)
          .then((stand) => {
             this.loading.dismiss();
             this.errors = null;
             this.stand = stand;
          })
          .catch(error => {
            this.loading.dismiss();
            this.errors = error;
          });
  }
  
  onChangeItem() {
      this.editSave = true;
  }
  
  onChangeMerchant() {
     this.merchants.forEach((merchant)=>{
         if( merchant.id == this.stand.merchant_id) {
             this.merchant = merchant;
         }
     });
     
     this.editSave = true;
  }
  
  async presentActionMerchant() {
    let merchant = null; 
    let buttons = [];

    for (let i = 0; i < this.merchants.length; i++) {
      merchant = this.merchants[i];
      let style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = '.customCSSClass' + i + '{background: url(' + "'" + merchant.resources.url_image + "'" + ') no-repeat !important;background-size: 50px 50px !important;margin-left: 31px;padding-left: 63px !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      buttons.push({
        text: merchant.nick, 
        role: 'destructive', 
        cssClass: 'customCSSClass' + i,
        handler: () => {
          this.merchant = this.merchants[i];
          this.editSave = true;
        }
      });
    }     
    
    buttons.push({
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      });
      
      
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  
}
