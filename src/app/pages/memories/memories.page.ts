import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memories',
  templateUrl: './memories.page.html',
  styleUrls: ['./memories.page.scss'],
})
export class MemoriesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck(){
     document.querySelector<HTMLElement>('ion-router-outlet').style.top = '0px';
  }

}
