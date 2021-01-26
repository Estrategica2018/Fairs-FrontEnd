import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StandService {
	
  private stand = null;

  constructor() { }
  
  get(stand_id) {
	  
	  if(!this.stand || this.stand.id != stand_id ) {
		  
		  this.stand = {
			'id': '1',
		    'name': 'Pabellon-1',
		    'resources': {
			   'image_url': 'https://res.cloudinary.com/dfxkgtknu/image/upload/v1611542206/feria1/stand1_Easy-Resize.com_ehckdv.jpg',
			   'banners': [{
					'image_url': 'assets/images/fair1/pabellon-back-480x400.png',
					"rotation":{"_x":0,"_y":0,"_z":-0.010000000000000004,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.18999999999999928,"z":1.2300000000000002},"position":{"x":0.0900000000000003,"y":1.1200000000000008,"z":5.979999999999917},
					'callback': { 'pavilion_id': '2', 'type': 'pavilion' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
					"rotation":{"_x":-3.122502256758253e-17,"_y":0,"_z":-3.469446951953614e-18,"_order":"XYZ"},"scale":{"x":0.3099999999999994,"y":0.3499999999999994,"z":1.2300000000000002},"position":{"x":-0.009999999999999691,"y":0.8300000000000005,"z":5.979999999999917}
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
					"rotation":{"_x":-0.010000000000000031,"_y":-0.020000000000000004,"_z":-3.469446951953614e-18,"_order":"XYZ"},"scale":{"x":0.13999999999999924,"y":0.4199999999999995,"z":1.2300000000000002},"position":{"x":0.010000000000000302,"y":0.21999999999999997,"z":5.929999999999918}
			  }
			  
			  
			  ]
		    }
		  }
	  }
      return this.stand;
  }
}
