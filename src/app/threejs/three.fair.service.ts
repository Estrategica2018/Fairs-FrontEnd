import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {  GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FairService } from '../api/fair.service';
import { PavilionService } from '../api/pavilion.service';
import { StandService } from '../api/stand.service';
import { RoomService } from '../api/room.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ThreeFairService {

  aspect: number;
  camera: THREE.PerspectiveCamera;
  container: HTMLElement;
  controls: OrbitControls;
  hemisphere: THREE.HemisphereLight;
  mainLight: THREE.DirectionalLight;
  scene: THREE.Scene;
  plane: any;
  model: any;
  textures = [];
  mainScene = null;
  load = true;
  
  objSel = null;
  objScene = null;
  
  deltaX = 0.01;
  deltaY = 0.01;
  deltaZ = 0.01;
  far = 100;
  fov = 35;
  gammaFactor = 2.2;
  gammaOutput = true;
  near = 1;
  physicallyCorrectLights = true;
  
  renderer = new THREE.WebGLRenderer({ antialias: true });

  clock = new THREE.Clock();
  mixers = new Array<THREE.AnimationMixer>();
  flamingoPosition = new THREE.Vector3(0.50, 3.889, -10);
  
  flamingoUrl = 'https://rawcdn.githack.com/mrdoob/three.js/7249d12dac2907dac95d36227d62c5415af51845/examples/models/gltf/Flamingo.glb';
  
  
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  
  constructor(private fairService: FairService, 
			  private pavilionService : PavilionService,
			  private standService: StandService,
			  private roomService: RoomService,
			  private router: Router) {
      
  }
  
  directionalLightOptions = {
    color: 0xffffff,
    intensity: 5
  };

  hemisphereOptions = {
    skyColor: 0xddeeff,
    groundColor: 0x0f0e0d,
    intensity: 5
  };

  // CAMERA
  
  type = 'o';

  private createCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );

    this.camera.position.set(0, 0.5, 9.0);
  }

  // CONTROLS

  private createControls = () => {
      this.controls = new OrbitControls(this.camera, this.container);
      this.controls.enabled = false;
  }

  // LIGHTING

  private createLight = () => {
    this.hemisphere = new THREE.HemisphereLight(
      this.hemisphereOptions.skyColor,
      this.hemisphereOptions.groundColor,
      this.hemisphereOptions.intensity
    );

    this.mainLight = new THREE.DirectionalLight(
      this.directionalLightOptions.color,
      this.directionalLightOptions.intensity
    );
    this.mainLight.position.set(10, 10, 10);

    this.scene.add(this.hemisphere, this.mainLight);
  }

  // GEOMETRY

  private createModels = () => {
    const loadModel = (gltf: GLTF, position: THREE.Vector3, url: string) => {
      this.model = gltf.scene.children[0];
      this.model.position.copy(position);
	  this.model.rotation.x = -0.01;
	  this.model.rotation.y = -0.24;
	  this.model.rotation.z = -0.23;
	  this.model.name = 'Flamingo';
      this.model.scale.set(0.009, 0.009, 0.009);
 
      const animation = gltf.animations[0];

      const mixer = new THREE.AnimationMixer(this.model);
      this.mixers.push(mixer);

      const action = mixer.clipAction(animation);
      action.play();
      this.scene.add(this.model);
    }
	const loader = new GLTFLoader();
	loader.load(
	  this.flamingoUrl,
	  gltf => loadModel(gltf, this.flamingoPosition, this.flamingoUrl),
	  () => {},
	  err => console.log(err)
	);
  }

  // RENDERER

  private onWindowResize = () => {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer && this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  private createRenderer = () => {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.gammaFactor = this.gammaFactor;
    //this.renderer.gammaOutput = true;
    this.renderer.physicallyCorrectLights = true;

    this.container.appendChild(this.renderer.domElement);
    window.addEventListener( 'resize', this.onWindowResize);
    window.addEventListener( 'pointerdown', this.onPointerDown, false );
    window.addEventListener( 'click', this.onPointerDown, false );
	window.addEventListener( 'mousemove', this.onPointerDown, false );
	//window.addEventListener( 'wheel', function(e) {e.preventDefault();}, { capture: false, passive: true } );
	window.addEventListener( 'keydown', this.onKeydown);
  }


  private update = () => {
    const delta = this.clock.getDelta();
    this.mixers.forEach(x => x.update(delta));
	
	//
	var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
	var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
    var intersects = ray.intersectObjects( this.scene.children );
    if ( intersects.length > 0 ) {
		var obj = intersects[ 0 ].object;
		//obj.material.color.setHex( 0xffff00 );
	}
 }

  start = () => this.renderer.setAnimationLoop(() => {
    this.update();
	if(this.model && this.model.position.x  > -11 ) this.model.position.x -= 0.01;
    
    this.renderer.autoClear = false;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera)
  });

  stop = () => this.renderer.setAnimationLoop(null);


  // INITIALIZATION
  initialize = (container: HTMLElement, objScene, mainScene) => {
      
    this.container = container;
	this.mainScene = mainScene;
	this.load = false;
	
	if(this.scene && this.scene.children) {
		while(this.scene.children.length > 0) { 
			console.log(this.scene.children[0]);
			this.scene.remove(this.scene.children[0]); 
		}
	}
	else {
		this.scene = new THREE.Scene();
	}
	
	this.aspect = container.clientWidth / container.clientHeight;
	this.objScene = objScene;

    this.createCamera();
    this.createControls();
    this.createLight();
	
    if(objScene.type === 'fair') {
		this.createModels();
	}
    
	this.createRenderer();
	this.createBanners();
	this.createVideos();
    let texture = null;
	if(this.textures[objScene.resources.image_url]) {
		texture = this.textures[objScene.resources.image_url];
	}
	else {
		texture = new THREE.TextureLoader().load(objScene.resources.image_url, ()=>{
			this.load = true;
		});
		this.textures[objScene.resources.image_url] = texture;
	}
	
	//const sceneBackground = 0x8fbcd4;
    //this.scene.background = new Color(sceneBackground);
	this.scene.background = texture;

    this.start();
  }
  
  
  private onPointerDown = (event) => {
        
	event.preventDefault();
	
	var rect = this.renderer.domElement.getBoundingClientRect();
	this.mouse.x = ( ( event.clientX  - rect.left ) / this.container.clientWidth ) * 2 - 1;
	this.mouse.y = - ( ( event.clientY - rect.top ) / this.container.clientHeight ) * 2 + 1;
	
	this.raycaster.setFromCamera( this.mouse, this.camera,  );
	
	const intersects = this.raycaster.intersectObjects( this.scene.children, true );
	if ( intersects.length > 0 ) {
		if(this.objSel !== intersects[0].object) {
			if(this.objSel) {
				this.objSel.material.color.setHex(this.objSel.currentHex);
			}
			this.objSel = intersects[0].object;
			this.objSel.currentHex = this.objSel.material.color.getHex();
			if(this.objSel.callback) {
				this.objSel.material.color.setHex( 0xffff00 );
			}
		}
		
		let obj : any = null;
		obj = intersects[0].object;
		if(obj.callback) {
		    
			document.body.style.cursor = 'pointer';
		
			if(event.type === "click") {
				let objSel = null;
				if(obj.callback.type === 'pavilion') {
				   objSel = this.pavilionService.get(obj.callback.pavilion_id);
				   this.mainScene.onNavMenuChange(obj.callback.type,obj.callback.pavilion_id );
				}
				if(obj.callback.type === 'fair') {
				   objSel = this.fairService.get(obj.callback.fair_name);
				   this.mainScene.onNavMenuChange('main',null);
				}
				if(obj.callback.type === 'stand') {
				   objSel = this.standService.get(obj.callback.stand_id);
				   this.mainScene.onNavMenuChange('main',null);
				}
				if(obj.callback.type === 'room') {
				   objSel = this.roomService.get(obj.callback.room_id);
				}
				
				if(obj.callback.type === "speakers") {
					this.mainScene.onSpeakers();
					return;	
				}
				
				objSel.type = obj.callback.type;
				this.initialize(this.container, objSel, this.mainScene);
				
			}
		}
		else {
			if(event.type === "click") {
				if(this.plane && this.plane.material && this.plane.material.currentHex) {
					this.plane.material.color.setHex(this.plane.material.currentHex);
				}
				this.plane = intersects[0].object;
				this.plane.material.color.setHex( 0xffff00 );
			}
		}
	} 
	else {
		document.body.style.cursor = 'default';
		if(this.objSel) {
			this.objSel.material.color.setHex(this.objSel.currentHex);
			this.objSel = null;
		}
	}
  }
  
  createVideos = () => {
	  
	if(this.objScene && this.objScene.resources && this.objScene.resources.videos)
	this.objScene.resources.videos.forEach( (video, indx) => {

		  // create the video element
		const videoElem = document.createElement( 'video' );
		// video.id = 'video';
		// video.type = ' video/ogg; codecs="theora, vorbis" ';
		videoElem.src = video.video_url;
		videoElem.load(); // must call after setting/changing source
		videoElem.play();
		
		const videoImage = document.createElement( 'canvas' );
		videoImage.width = 480;
		videoImage.height = 204;

		const videoImageContext = videoImage.getContext( '2d' );
		// background color if no video present
		videoImageContext.fillStyle = '#000000';
		videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

		let videoTexture: any = null;
		videoTexture = new THREE.Texture( videoImage );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		
		/*const movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
		// the geometry on which the movie will be displayed;
		// 		movie image will be scaled to fit these dimensions.
		const movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
		const movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
		movieScreen.position.set(0,50,0);
		this.scene.add(movieScreen); */
	});
  }
  
  private createBanners = () => {
	  
	if(this.objScene && this.objScene.resources && this.objScene.resources.banners)
	this.objScene.resources.banners.forEach( (banner, indx) => {

		const geometry = new THREE.PlaneGeometry( 5, 1, 1);
		let material = null;
		
		if(banner.image_url) {
			let texture: any = null;
			texture = THREE.TextureLoader;
			if(this.textures[banner.image_url]) {
				texture = this.textures[banner.image_url];
			}
			else {
				texture = new THREE.TextureLoader().load(banner.image_url);
				this.textures[banner.image_url] = texture;
			}
			material = new THREE.MeshBasicMaterial({ map: texture });
		}
		
		if(banner.backgroundColor) {
			const backgroundColor = 0x8fbcd4;
			material = new THREE.MeshBasicMaterial({ color: new THREE.Color(backgroundColor) });
		}
		
		if(banner.text) {
			
			const loader = new THREE.FontLoader();

			loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

				const geometryThree = new THREE.TextGeometry( banner.text, {
					font: font,
					size: 80,
					height: 5,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 10,
					bevelSize: 8,
					bevelOffset: 0,
					bevelSegments: 5
				});
				
				const _text = new THREE.Mesh( geometryThree, material );
				this.scene.add( _text );
			});
		}

    	const plane: any = new THREE.Mesh( geometry, material );
		plane.name = "BannerPlaneGeometry-" + indx;
		plane.rotation.x = banner.rotation._x;
		plane.rotation.y = banner.rotation._y;
		plane.rotation.z = banner.rotation._z;
		plane.position.x = banner.position.x;
		plane.position.y = banner.position.y;
		plane.position.z = banner.position.z;
		plane.scale.x = banner.scale.x;
		plane.scale.y = banner.scale.y;
		plane.scale.z = banner.scale.z;
		
		if(banner.callback) {
			plane.callback = banner.callback;
		}
		
		plane.container = this.container;
		
		this.scene.add( plane );

    });
  }
  
  private onKeydown = (event) => {
	  
	const obj = this.plane; 
	//const obj = this.model; 
	switch ( event.keyCode ) {
		case 79: // O
			this.type  = 'O';
			break;
		case 76: // L
			this.type  = 'L';
			break;
		case 80: // P
			this.type  = 'P';
			break;
		case 77: // M	
			console.log(JSON.stringify({rotation: obj.rotation, scale: obj.scale, position: obj.position}));
			break;
	}
	
	if(this.type==="O")
	switch ( event.keyCode ) {
		case 65: // A
			obj.position.x -= 0.01;
			break;
		case 68: // D
			obj.position.x += 0.01;
			break;
		case 87: // W
			obj.position.z -= 0.01;
			break;
		case 83: // S
			obj.position.z += 0.01;
			break;
		case 89: // Y
			obj.position.y -= 0.01;
			break;
		case 72: // H
			obj.position.y += 0.01;
			break;
	}
	if(this.type==="L")
	switch ( event.keyCode ) {
		case 65: // A
			obj.scale.x -= 0.01;
			break;
		case 68: // D
			obj.scale.x += 0.01;
			break;
		case 87: // W
			obj.scale.z -= 0.01;
			break;
		case 83: // S
			obj.scale.z += 0.01;
			break;
		case 89: // Y
			obj.scale.y -= 0.01;
			break;
		case 72: // H
			obj.scale.y += 0.01;
			break;
	}
	if(this.type==="P")
	switch ( event.keyCode ) {
		case 65: // A
			obj.rotation.x -= 0.01;
			break;
		case 68: // D
			obj.rotation.x += 0.01;
			break;
		case 87: // W
			obj.rotation.z -= 0.01;
			break;
		case 83: // S
			obj.rotation.z += 0.01;
			break;
		case 89: // Y
			obj.rotation.y -= 0.01;
			break;
		case 72: // H
			obj.rotation.y += 0.01;
			break;
	}
	
	this.renderer.render(this.scene, this.camera);
    
  }
  
}

