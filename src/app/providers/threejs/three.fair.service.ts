import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {  GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  modelLoaderList = {};

  clock = new THREE.Clock();
  mixers = new Array<THREE.AnimationMixer>();

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  directionalLightOptions = {
    color: 0xffffff,
    intensity: 5
  };

  hemisphereOptions = {
    skyColor: 0xddeeff,
    groundColor: 0x0f0e0d,
    intensity: 5
  };

  type = 'o';

  
  constructor() {
     
  }
  
  // CAMERA
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
    const loadModel = (gltf: GLTF, position: THREE.Vector3, url: string, name: string) => {
    
      if(!this.modelLoaderList[name]) {
          this.modelLoaderList[name] = { gltf: gltf, position: position, url: url, name: name}
      }
      this.model = gltf.scene.children[0];
      
      this.model.position.copy(position);
      this.model.rotation.x = -0.01;
      this.model.rotation.y = -0.24;
      this.model.rotation.z = -0.23;
      this.model.name = "model-" + name;
      this.model.scale.set(0.009, 0.009, 0.009);
 
      const animation = gltf.animations[0];

      const mixer = new THREE.AnimationMixer(this.model);
      this.mixers.push(mixer);

      const action = mixer.clipAction(animation);
      action.play();
      this.scene.add(this.model);
    }
    
    const loader = new GLTFLoader();
    
    const initModel = (position: THREE.Vector3, url: string, name: string) => {
    
      if(!this.modelLoaderList[name]) {
        loader.load(
          url,
          gltf => loadModel(gltf, position, url, name),
          () => {},
          err => console.log(err)
        );
      }
      else {
         const model = this.modelLoaderList[name];
         loadModel(model.gltf, position, url, name);
      }
    }
    
    initModel(new THREE.Vector3(0.50, 3.889, -10),'https://rawcdn.githack.com/mrdoob/three.js/7249d12dac2907dac95d36227d62c5415af51845/examples/models/gltf/Flamingo.glb','flamingo')
    
  }

  // RENDERER

  public onWindowResize = (fullScreen) => {
      
    if(typeof this.container === 'undefined') return;
    
	let height = fullScreen ? window.innerHeight : window.innerHeight;
    let width = height * 1094 / 544;
    this.camera.aspect = width / height;
	//this.camera.aspect = 1094 / 544;
    this.camera.updateProjectionMatrix();
    
    this.setSizeRender(fullScreen);
  }
  
  private setSizeRender(fullScreen) {
	  
	let heightFull = fullScreen ? window.innerHeight : window.innerHeight;
    let width = heightFull * 1094 / 544;
    let height = heightFull;
    
    if(width<this.container.clientWidth) {
        //width = fullScreen ? window.innerWidth + (34 * 1094/544) : window.innerWidth;
        //height = width * 544 / 1094;
    }
	
	
	//this.renderer && this.renderer.setSize(width, height);//
	//this.renderer && this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer && this.renderer.setSize(width, height);
  }

  private createRenderer = () => {
    
    this.setSizeRender(false);
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
    
   let id = setInterval(() => {
     clearInterval(id);
     this.onWindowResize(false); 
   }, 2500);
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
    this.renderer.autoClear = false;
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera)
  });

  stop = () => this.renderer.setAnimationLoop(null);
  
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
                
                
                objSel.type = obj.callback.type;
                this.initialize(this.container, objSel);
                
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
  
  private createVideos = () => {
      
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
        //         movie image will be scaled to fit these dimensions.
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

  // INITIALIZATION
  initialize = (container: HTMLElement, objScene) => {
      
    this.container = container;
    this.scene = new THREE.Scene();
    
    this.aspect = window.innerWidth / window.innerHeight;
    this.objScene = objScene;

    this.createCamera();
    this.createControls();
    this.createLight();
    this.createRenderer();
    this.createBanners();
    this.createVideos();
    let texture = null;
    if(this.textures[objScene.resources.url_image]) {
        texture = this.textures[objScene.resources.url_image];
    }
    else {
        texture = new THREE.TextureLoader().load(objScene.resources.url_image, ()=>{
            
        });
        this.textures[objScene.resources.url_image] = texture;
    }
    
    this.scene.background = texture;

    this.start();
  }

}
