import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
})
export class SocialMediaComponent implements OnInit {

  constructor() { }
  
  isHover = null;

  ngOnInit() {}
  
  openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

}
