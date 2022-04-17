import { Component, OnInit } from '@angular/core';
import { FairsService } from '../../../api/fairs.service';
import { AgendasService } from './../../../api/agendas.service';
import { CategoryService } from './../../../api/category.service';
import { AdminFairsService } from './../../../api/admin/fairs.service';
import { UsersService } from './../../../api/users.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ToastController,AlertController, ModalController } from '@ionic/angular';
import { processData } from '../../../providers/process-data';
import { LoadingService } from '../../../providers/loading.service';
import { LoginComponent } from '../../login/login.component';


@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.page.html',
  styleUrls: ['./agenda-list.page.scss'],
})
export class AgendaListPage implements OnInit {

  fair: any;
  agendas: any;
  errors: string;
  success: string;
  showPrice = false;
  profileRole: any = null;
  groupsCategoryList = [];
  modal: any;
  userDataSession: any;
  editSave = false;
  
  constructor(
    private fairsService: FairsService,
    private agendasService: AgendasService,
    private categoryService: CategoryService,
    private datepipe: DatePipe,
    private alertCtrl: AlertController,
    private loading: LoadingService,
    private modalCtrl: ModalController,
    private usersService: UsersService,
    private toastCtrl: ToastController,
    private adminFairsService: AdminFairsService,
  ) { 
  
  }
  
  ngOnInit() { 

      this.usersService.getUser()
      .then((userDataSession: any)=>{
        this.userDataSession = userDataSession;
        if(this.userDataSession) {
            this.profileRole = {};
            if(userDataSession && userDataSession.user_roles_fair)  {
              userDataSession.user_roles_fair.forEach((role)=>{
                if(role.id == 1) { //"super_administrador"
                   this.profileRole.admin = true;
                }
              });
            }
            
          this.loading.present({message:'Cargando...'});  
          this.fairsService.getCurrentFair().
          then( fair => {
            this.fair = fair;
            this.showPrice = fair.price > 0;
            
            this.agendasService.list()
            .then((agendas) => {
                this.agendas = agendas;
                if(agendas)
                this.agendas.forEach((agenda)=>{
                    agenda.startTime = this.datepipe.transform(new Date(agenda.start_at), 'hh:mm a');
                    agenda.endTime = this.datepipe.transform(new Date(agenda.start_at + agenda.duration_time * 60000), 'hh:mm a');
                    agenda.location = agenda.room ? agenda.room.name : '';
                });
                
                this.categoryService.list('all', this.fair)
                .then((response) => {
                    this.groupsCategoryList = [ { "label":"Categorías para agenda", "name": "AgendaType", "values":[] },{ "label":"Categorías para productos", "name": "ProductCategory", "values":[] }];
                    if(response.success == 201 ) {
                       response.data.forEach((category)=>{
                          if(category.type=='AgendaType') { this.groupsCategoryList[0].values.push(category); }
                          else if(category.type=='ProductCategory') { this.groupsCategoryList[1].values.push(category); }
                       });
                    }
                    this.loading.dismiss();
                 })
                 .catch(error => {
                    this.loading.dismiss(); 
                    this.errors = `Consultando el servicio para categorias: ${error}`;
                 });
                
                this.loading.dismiss(); 
                
             })
             .catch(error => {
                this.loading.dismiss(); 
                this.errors = `Consultando el servicio para agenda: ${error}`;
             });
          }, errors => {
              this.errors = errors;
              this.loading.dismiss();     
          })
          .catch(error => {
              this.loading.dismiss();
              this.errors = `Consultando el servicio para agenda: ${error}`;
          });
        }
      });
  } 
  
  async presentActionPrice() {
      
    if(!this.showPrice) return;
    
    const actionAlert = await this.alertCtrl.create({
      header: 'Precio general de la feria',
      message: "Ingresa un precio general para toda la feria",
      inputs: [
        {
          name: 'price',
          value: this.fair.price,
          placeholder: '$ Precio'
        },
      ],
      buttons: [{
          text: 'Cancel',
          role: 'cancel'
        },{
         text: 'Guardar', 
         role: 'destructive', 
         handler: (data) => {
          this.fair.price = data.price;
          this.updateFairPrice();
         }
        }]
    });
    await actionAlert.present();

  }
  
  updateFairPrice() {
   this.success = null;
   this.errors = null;
   
   this.loading.present({message:'Cargando...'});
   if(!this.showPrice) {    
      this.fair.price = 0;
   }

   const fairObj = {'id': this.fair.id, 'price': this.fair.price};
   this.adminFairsService.updateFair(fairObj).
      then( response => {
        this.fair = processData(response.data_fair);
        this.success = `Precio de la feria modificado exitosamente`;
        this.loading.dismiss();      
      }, errors => {
          this.errors = `Consultando el servicio para modificar el precio de la feria`;
          this.loading.dismiss();
      })
    .catch(error => {
        this.errors = error; 
        this.loading.dismiss();
     });      
  }
  
  
} 