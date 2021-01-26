import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PavilionService {
  
  private pavilion = null;
  private pavilion_list = [];
  
  constructor() { }
    list(fair_id) {
		this.pavilion_list = [{
			'id': '1',
			'name': 'Pabellon Principal',
			'stands': [{
				'id': '1',
				'name': '',
				'merchant': {'id': 1,'name': 'Sura S.A.S'}
			},{
				'id': '2',
				'name': '',
				'merchant': {'id': 2,'name': 'Yulu SCS'}
			},{
				'id': '3',
				'name': '',
				'merchant': {'id': 3,'name': 'Macumba S.A'}
			},{
				'id': '4',
				'name': '',
				'merchant': {'id': 4,'name': 'Ganadera Tiacuane S.A.S'}
			},{
				'id': '5',
				'name': '',
				'merchant': {'id': 5,'name': 'Los Robles S.A.S'}
			},{
				'id': '6',
				'name': '',
				'merchant': {'id': 6,'name': 'La Arboleda S.A.S'}
			},{
				'id': '7',
				'name': '',
				'merchant': {'id': 7,'name': 'La Fantasia Ltda En Liquidación'}
			},{
				'id': '8',
				'name': '',
				'merchant': {'id': 8,'name': 'Villasol S.A '}
			},{
				'id': '9',
				'name': '',
				'merchant': {'id': 9,'name': 'Sociedad Ganadera de Exportaciones'}
			}]
		}];
		
		return this.pavilion_list;
	}
	get(pavilion_id){
	  
	  if(!this.pavilion || this.pavilion.id != pavilion_id ) {
		
		if(Number(pavilion_id) === 1) 
		this.pavilion = {
		  'id': '1',
		  'name': 'Pabellon Principal',
		  'resources': {
			 'image_url': 'https://res.cloudinary.com/dfxkgtknu/image/upload/v1611542205/feria1/pabellon1_Easy-Resize.com_tl2yqr.jpg',
			 'banners': [{
					'image_url': 'assets/images/fair1/banner-680x400.png',
					"rotation":{"_x":-0.10999999999999999,"_y":0.9100000000000014,"_z":-0.01,"_order":"XYZ"},"scale":{"x":0.659999999999999,"y":1.690000000000001,"z":1},"position":{"x":-2.5099999999999896,"y":1.9400000000000013,"z":-0.15}
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
					"rotation":{"_x":-0.11999999999999998,"_y":0.7900000000000011,"_z":0,"_order":"XYZ"},"scale":{"x":0.5599999999999989,"y":1.2400000000000007,"z":1},"position":{"x":1.180000000000002,"y":0.9300000000000006,"z":-0.9300000000000006}
			  },
			  {
					'image_url': 'assets/images/fair1/banner-1200x180.png',
					"rotation":{"_x":0.02000000000000003,"_y":0.16000000000000075,"_z":-0.04000000000000001,"_order":"XYZ"},"scale":{"x":0.579999999999999,"y":0.9100000000000004,"z":1},"position":{"x":-3.2299999999999742,"y":-2.3699999999999934,"z":-0.7800000000000005}
			  },
			  {
					'image_url': 'assets/images/fair1/banner-1366x768.png',
					"rotation":{"_x":-0.06999999999999992,"_y":0.620000000000001,"_z":-0.06999999999999992,"_order":"XYZ"},"scale":{"x":0.1799999999999986,"y":0.23999999999999977,"z":1.3800000000000003},"position":{"x":-0.9499999999999995,"y":0.3300000000000001,"z":5.919999999999918}
			  },
			  {
					'image_url': 'assets/images/fair1/pavillion1-480x400.png',
					"rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.36999999999999944,"y":1.9700000000000009,"z":1},"position":{"x":1.7900000000000014,"y":-1.6600000000000013,"z":0},
			  },
			  {
					'image_url': 'assets/images/fair1/pabellon-back-480x400.png',
					"rotation":{"_x":0,"_y":0,"_z":-0.010000000000000004,"_order":"XYZ"},"scale":{"x":0.059999999999999255,"y":0.15999999999999925,"z":1.2300000000000002},"position":{"x":-1.3100000000000007,"y":0.12000000000000006,"z":5.889999999999919},
					'callback': { 'fair_name': 'feriaganadera2021', 'type': 'fair' }
			  },
			  {
					'image_url': 'assets/images/fair1/menu-pabellon2-520x230.png',
					"rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.25999999999999934,"y":0.5699999999999996,"z":1},"position":{"x":3.7199999999999647,"y":2.289999999999995,"z":-0.03},
					'callback': { 'pavilion_id': '2', 'type': 'pavilion' }
			  },
			  {
					'image_url': 'assets/images/fair1/menu-auditorio1-520x230.png',
					"rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.25999999999999934,"y":0.5699999999999996,"z":1},"position":{"x":3.709999999999965,"y":1.640000000000001,"z":0.010000000000000004},
					'callback': { 'room_id': '1', 'type': 'room' }
			  },
			  {
					'image_url': 'assets/images/fair1/menu-speakers-520x230.png',
					"rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.25999999999999934,"y":0.5699999999999996,"z":1},"position":{"x":3.749999999999964,"y":1.0000000000000004,"z":-0.03},
					'callback': { 'fair_name': 'feriaganadera2021', 'type': 'speakers' }
			  }]
		   }
		}		 

		if(Number(pavilion_id) === 2) 
		this.pavilion = {
		  'id': '2',
		  'name': 'Pabellon-2',
		  'resources': {
			 'image_url': 'https://res.cloudinary.com/dfxkgtknu/image/upload/v1611542206/feria1/pabellon2_Easy-Resize.com_i9o9nv.jpg',
			 'banners': [{
					'image_url': 'assets/images/fair1/banner-680x400.png',
					"rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":-1.3800000000000008,"y":-0.11999999999999995,"z":5.81999999999992},
					'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
					"rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.07999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":0.4800000000000006,"y":-0.09999999999999996,"z":5.81999999999992},
					'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.07999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":1.4200000000000013,"y":-0.11999999999999995,"z":5.81999999999992},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":0.5200000000000006,"y":0.4700000000000003,"z":5.549999999999926},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/back-pavilion-680x400.png',
					"rotation":{"_x":-0.08,"_y":0,"_z":0.010000000000000004,"_order":"XYZ"},"scale":{"x":0.06999999999999926,"y":0.14999999999999925,"z":1},"position":{"x":-1.3900000000000008,"y":1.0200000000000007,"z":5.609999999999925},
					'callback': { 'pavilion_id': '1', 'type': 'pavilion' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":-0.49000000000000005,"y":0.4700000000000003,"z":5.549999999999926},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":-1.4700000000000009,"y":0.4700000000000003,"z":5.549999999999926},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":1.5200000000000014,"y":0.4900000000000003,"z":5.549999999999926},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":1.0000000000000009,"y":0.15000000000000002,"z":5.599999999999925},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1},"position":{"x":0.020000000000000136,"y":0.16000000000000003,"z":5.6699999999999235},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },			  
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
				     "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.08999999999999925,"y":0.27999999999999936,"z":1.08},"position":{"x":-1.0000000000000004,"y":0.20000000000000007,"z":5.519999999999927},
					 'callback': { 'stand_id': '1', 'type': 'stand' }
			  },			  
			  {
					'image_url': 'assets/images/fair1/banner-auditorio1-520x230.png',
				    "rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":0.3099999999999994,"y":0.5899999999999996,"z":1},"position":{"x":0.010000000000000198,"y":0.9800000000000006,"z":5.789999999999921},
					'callback': { 'room_id': '1', 'type': 'room' }
			  }]
		   }
		}		 
	    

	  }
	  
	  return this.pavilion;
  }
}


