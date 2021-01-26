import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';			

@Injectable({
  providedIn: 'root'
})
export class FairService {
	
  private fairName: string;
  private fair = null;

  constructor(private activatedRoute: ActivatedRoute) { 
      
  }
  
  get (fairName){
	  
	  if(!this.fair || this.fairName != fairName) {
	    
		this.fairName = this.getFairName();
	  
	    this.fair = {
		  'id': '1',
		  'name': 'FeriaGanadera2021',
		  'description': 'XI Feria Ganadera 2021',
		  'nick': 'XI Feria Ganadera 2021',
		  'resources': {
			 'image_url': 'https://res.cloudinary.com/dfxkgtknu/image/upload/v1611542204/feria1/feria_Easy-Resize.com_j9svzu.jpg',
			 'banners': [{
					'image_url': 'assets/images/fair1/banner-1200x180.png',
					"rotation":{"_x":-0.04,"_y":-1,"_z":0},"scale":{"x":1.5599999999999998,"y":0.3999999999999999,"z":1},"position":{"x":-1.59,"y":1.5700000000000012,"z":-0.8600000000000005}
			  },
			  {
					'image_url': 'assets/images/fair1/banner-1366x768.png',
					"rotation":{"_x":-0.019999999999999997,"_y":0.8000000000000013,"_z":-0.02,"_order":"XYZ"},"scale":{"x":0.2999999999999987,"y":1.4400000000000008,"z":1.4500000000000004},"position":{"x":-3.869999999999961,"y":0.1399999999999999,"z":0}
			  },
			  {
					'image_url': 'assets/images/fair1/banner-680x400.png',
					"rotation":{"_x":3.469446951953614e-18,"_y":0.8300000000000012,"_z":-0.030000000000000006,"_order":"XYZ"},"scale":{"x":0.19999999999999862,"y":0.9700000000000004,"z":1.4500000000000004},"position":{"x":-2.549999999999989,"y":0.27,"z":3.0699999999999785}
			  },
			  {
					'image_url': 'assets/images/fair1/banner-480x400.png',
					"rotation":{"_x":-0.06000000000000001,"_y":0.7200000000000012,"_z":0,"_order":"XYZ"},"scale":{"x":0.32999999999999874,"y":0.7500000000000002,"z":1},"position":{"x":2.0000000000000027,"y":-0.04,"z":0},
					'callback': { 'pavilion_id': '1', 'type': 'pavilion' }
			  },
			  {
				  'image_url': 'assets/images/fair1/banner-680x300-estrategica.png',
				  "rotation":{"_x":-0.11999999999999995,"_y":0.6500000000000004,"_z":-0.019999999999999997,"_order":"XYZ"},"scale":{"x":0.4599999999999995,"y":0.6399999999999997,"z":1},"position":{"x":2.669999999999987,"y":1.6400000000000012,"z":1.2200000000000009},
				  'callback': { 'url': 'https://www.estrategicacomunicaciones.com/', 'type': 'link' }
			  }]
		   }
		}		 
	  }
	  
	  return this.fair;
  }
  
  getFairName() {

	  /*this.activatedRoute.snapshot
      .params.subscribe(params => {
		  console.log(params);
        this.fairName = params["name"];
      });
	  */
	  let name = null;	
	  try {
		  var spl = window.location.pathname.split('/feria/')[1].split('/');
		  if(spl.length===2) {
			name = spl[spl.length-2];  
		  }
		  else if(spl.length===1) {
			name = spl[spl.length-1];
		  }
	    }catch(e) {
			//alert(e);
		}
		
	  if(name===null) {
		  //window.location.href="https://educonexiones.com/feriasVirtuales/";
	  }
	  
	  return name;
  }
}
