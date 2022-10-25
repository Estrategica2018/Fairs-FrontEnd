import { Component, OnInit } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { AgendasService } from './../../../../api/agendas.service';
import { LoadingService } from './../../../../providers/loading.service';

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.scss'],
})
export class AgendaListComponent implements OnInit {

  
  template: any;
  catalogList: any = [];
  fair: any;
  pavilion: any;
  stand: any;
  category: any;
  showAgendas = false;
  categorySelected = 'all';
  showOnlyOne = false;
  agendaList: any;
  
  constructor(private modalCtrl: ModalController,
    private navParams: NavParams,
    private loading: LoadingService,
    private agendasService: AgendasService) { }

  ngOnInit() {
      
      this.loading.present({message:'Cargando...'});
      this.template = this.navParams.get('template');
      this.fair = this.navParams.get('fair');
      this.pavilion = this.navParams.get('pavilion');
      this.stand = this.navParams.get('stand');
      this.agendaList = [];
      
      this.agendasService.getByCategory(null)
      .then((agendas) => {
          this.loading.dismiss();
          for(let agenda of agendas) {
            this.addCategory(agenda);
            this.agendaList.push(agenda);
          }
          
      })
      .catch(error => {
          this.loading.dismiss();
      });
  }

 addCategory(agenda) {
    for( let cat of this.catalogList) {
      if(agenda.category.id == cat.id) {
        cat.agendas = cat.agendas || [];
        cat.agendas.push(agenda);
        return cat;
      }
    }

    this.catalogList.push(agenda.category);
    agenda.category.agendas = agenda.category.agendas || [];
    agenda.category.agendas.push(agenda);
    console.log(agenda.category);
    return agenda.category;
  }
  
  dismissModal() {
     this.modalCtrl.dismiss(null);
  }

  acceptModal() {
     this.modalCtrl.dismiss( { "categorySelected":this.categorySelected, "agendaList":this.agendaList } );
  }

  onChangeItem(){
    this.agendaList = [];
      
    
       for(let cat of this.catalogList) {
        for(let agenda of cat.agendas) {
          if(this.categorySelected == 'all' || this.categorySelected == agenda.category.id) {
             this.agendaList.push(agenda);
          }
        }

    }
    
  }

}

