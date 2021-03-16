import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.page.html',
  styleUrls: ['./meeting.page.scss'],
})
export class MeetingPage implements OnInit {
  
  link = null;
  
  constructor(private dom:DomSanitizer) { }
  
  ngOnInit() {
      const url = 'http://127.0.0.1:9999/meeting.html?name=SW52aXRhZG8%3D&mn=81589051101&email=&pwd=QlZrTXZjNmtKQ3Bnbm05V0djdlRQQT09&role=0&lang=en-US&signature=dWRwd1A1Y1VSVHVwaEJsa3hmUFJhdy44MTU4OTA1MTEwMS4xNjE0MTIxODM0NTIwLjAubzlOdDVYZVg5NG1mRThFUTNuNWJnYXE4cWU4RzV0WENCUS93SnhQazNNdz0&china=0&apiKey=udpwP5cURTuphBlkxfPRaw';
      this.link =this.dom.bypassSecurityTrustResourceUrl(url); 
  }

}
