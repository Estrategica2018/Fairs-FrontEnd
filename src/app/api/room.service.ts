import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  room = null;
  
  constructor() { }
  
  get(roomId) {
	if(this.room === null) {
		this.room = {
			'id':1,
			'name': '',
			'resources': {
				'image_url': 'https://res.cloudinary.com/dfxkgtknu/image/upload/v1611542378/feria1/auditorio1-background_Easy-Resize.com_m1sazv.jpg',
				'banners': [/*{
					'image_url': 'assets/images/fair1/banner-680x400.png',
				    "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":1,"y":1,"z":1},"position":{"x":0,"y":0,"z":0}
				},{
					'image_url': 'assets/images/fair1/banner-680x400.png',
				    "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":1,"y":1,"z":1},"position":{"x":0,"y":0,"z":0}
				}],
				'videos': [{
					'video_url': 'https://player.vimeo.com/video/286898202',
				    "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.1999999999999993,"y":0.6799999999999997,"z":1},"position":{"x":1.3530843112619095e-16,"y":0.16000000000000003,"z":5.549999999999926},
				}*/],
			}
		}
	}
	
	return this.room;
	  
  }
}
