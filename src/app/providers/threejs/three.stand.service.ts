import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {  GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ThreeStandService {

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
  
  constructor() {
     
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

  public onWindowResize = () => {
      
    if(typeof this.container === 'undefined') return;
    
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    this.setSizeRender();
  }
  
  private setSizeRender() {
    let heightFull = this.mainScene.fullScreen ? window.innerHeight + 34 : window.innerHeight;
    let width = heightFull * 1079 / 544;
    let height = heightFull;
    
    if(width<this.container.clientWidth) {
        let widthFull = this.mainScene.fullScreen ? window.innerWidth : this.container.clientWidth;
        height = widthFull * 544 / 1079;
        width = widthFull;
    }
    this.renderer && this.renderer.setSize(width, height);
  }

  private createRenderer = () => {
    
    this.setSizeRender();
    this.renderer.setPixelRatio(window.devicePixelRatio);  

    this.renderer.gammaFactor = this.gammaFactor;
    //this.renderer.gammaOutput = true;
    this.renderer.physicallyCorrectLights = true;

    this.container.appendChild(this.renderer.domElement);
    this.container.addEventListener( 'resize', this.onWindowResize);
    this.container.addEventListener( 'pointerdown', this.onPointerDown, false );
    this.container.addEventListener( 'click', this.onPointerDown, false );
    this.container.addEventListener( 'mousemove', this.onPointerDown, false );
    this.container.addEventListener( 'wheel', function(e) {e.preventDefault();}, { capture: false, passive: true } );
    this.container.addEventListener( 'keydown', this.onKeydown);
    
    let id = setInterval(() => {
      clearInterval(id);
      this.onWindowResize(); 
    }, 1500);
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
    if(this.mainScene.setLoading) this.mainScene.setLoading(true);
    
    if(this.scene && this.scene.children) {
        while(this.scene.children.length>0) {
          this.scene.remove(this.scene.children[0]);
        }
        
        for(var i=0;i<this.scene.children.length; i++) {
            console.log(this.scene.children[i].name);
            if(this.scene.children[i].name.indexOf('model-') < 0){
                this.scene.remove(this.scene.children[i]); 
            }
            else {
                console.log('model');
            }
        }
        /*while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]); 
        }*/
    }
    else {
        this.scene = new THREE.Scene();
    }
    
    this.aspect = container.clientWidth / container.clientHeight;
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
        if(this.mainScene.setLoading) this.mainScene.setLoading(false);
    }
    else {
        texture = new THREE.TextureLoader().load(objScene.resources.url_image, ()=>{
            if(this.mainScene.setLoading) this.mainScene.setLoading(false);
        });
        this.textures[objScene.resources.url_image] = texture;
    }
    
    //const sceneBackground = 0x8fbcd4;
    //this.scene.background = new Color(sceneBackground);
    this.scene.background = texture;

    this.start();
  }
  
  
  private onPointerDown = (event) => {
        
    event.preventDefault();
    
	let heightFull = this.mainScene.fullScreen ? window.innerHeight + 34 : window.innerHeight;
    let width = heightFull * 1079 / 544;
    let height = heightFull;
    
    if(width<this.container.clientWidth) {
        let widthFull = this.mainScene.fullScreen ? window.innerWidth : this.container.clientWidth;
        height = widthFull * 544 / 1079;
        width = widthFull;
    }
    var rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ( ( event.clientX  - rect.left ) / width ) * 2 - 1;
    this.mouse.y = - ( ( event.clientY - rect.top ) / height ) * 2 + 1;
    
    this.raycaster.setFromCamera( this.mouse, this.camera );
    
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
