import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {  GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ThreePavilionService {

  renderer = null;
  scene: THREE.Scene = null;
  
  constructor() {
     
  }

  // INITIALIZATION
  initialize = (container: HTMLElement, objScene:any, mainScene: any) => {
      
    let _self = this;
	
//	THREE.Cache.clear();
    let aspect: number;
    let _defaultWidth = objScene.resources._defaultWidth;
    let _defaultHeight = objScene.resources._defaultHeight;
    let camera: THREE.PerspectiveCamera;
    let controls: OrbitControls;
    let hemisphere: THREE.HemisphereLight;
    let mainLight: THREE.DirectionalLight;
    
    let plane: any;
    let model: any;
    let textures = [];
  
    let objSel = null;
  
    let deltaX = 0.01;
    let deltaY = 0.01;
    let deltaZ = 0.01;
    let far = 100;
    let fov = 35;
    let gammaFactor = 2.2;
    let gammaOutput = true;
    let near = 1;
    let physicallyCorrectLights = true;
  
  
    //const canvas = document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({
      container,
      alpha: true,
    });
	this.renderer.setClearColor( 0x000000, 0 ); // the default
    
    //this.renderer = new THREE.WebGL.renderer({ alpha: false, });
    let modelLoaderList = {};

    let clock = new THREE.Clock();
    let mixers = new Array<THREE.AnimationMixer>();

    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    
    let directionalLightOptions = {
      color: 0xffffff,
      intensity: 5
    };

    let hemisphereOptions = {
      skyColor: 0xddeeff,
      groundColor: 0x0f0e0d,
      intensity: 5
    };
    
    let type = 'O';

    //BACKGROUND
    function createBackGround (scene) {
       let texture = null;
    
       if(textures[objScene.resources.url_image]) {
         texture = textures[objScene.resources.url_image];
       }
       else {
         texture = new THREE.TextureLoader().load(objScene.resources.url_image, ()=>{
         });
         textures[objScene.resources.url_image] = texture;
       }
       //const sceneBackground = 0x8fbcd4;
       //scene.background = new Color(sceneBackground);
       scene.background = texture;
    }
    
    // CAMERA
    function createCamera() {
      camera = new THREE.PerspectiveCamera(
        fov,
        aspect,
        near,
        far
      );
  
      camera.position.set(0, 0.5, 9.0);
    }
  
    // CONTROLS
    function createControls() {
        controls = new OrbitControls(camera, container);
        controls.enabled = false;
    }
  
    // LIGHTING
    function createLight(scene) {
      hemisphere = new THREE.HemisphereLight(
        hemisphereOptions.skyColor,
        hemisphereOptions.groundColor,
        hemisphereOptions.intensity
      );
  
      mainLight = new THREE.DirectionalLight(
        directionalLightOptions.color,
        directionalLightOptions.intensity
      );
      mainLight.position.set(10, 10, 10);
  
      scene.add(hemisphere, mainLight);
    }
  
    // GEOMETRY
    function createModels(scene) {
      
	  const loadModel = (gltf: GLTF, position: THREE.Vector3, url: string, name: string) => {
      
        if(!modelLoaderList[name]) {
            modelLoaderList[name] = { gltf: gltf, position: position, url: url, name: name}
        }
        model = gltf.scene.children[0];
        
        model.position.copy(position);
        model.rotation.x = -0.01;
        model.rotation.y = -0.24;
        model.rotation.z = -0.23;
        model.name = "model-" + name;
        model.scale.set(0.009, 0.009, 0.009);
   
        const animation = gltf.animations[0];
  
        const mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);
  
        const action = mixer.clipAction(animation);
        action.play();
        scene.add(model);
      }
      
      const loader = new GLTFLoader();
      
      const initModel = (position: THREE.Vector3, url: string, name: string) => {
      
        if(!modelLoaderList[name]) {
          loader.load(
            url,
            gltf => loadModel(gltf, position, url, name),
            () => {},
            err => console.log(err)
          );
        }
        else {
           const model = modelLoaderList[name];
           loadModel(model.gltf, position, url, name);
        }
      }
      
      initModel(new THREE.Vector3(0.50, 3.889, -10),'https://rawcdn.githack.com/mrdoob/three.js/7249d12dac2907dac95d36227d62c5415af51845/examples/models/gltf/Flamingo.glb','flamingo')
      
    }
	
	
  
    // renderer
    function onWindowResize() {
        
      const fullScreen : boolean = mainScene.fullScreen;
      const heightFull = fullScreen ? container.clientHeight + 34 : container.clientHeight;
      let width = heightFull * _defaultWidth / _defaultHeight;
      let height = heightFull;
      if(width<container.clientWidth) {
        let widthFull = container.clientWidth;
        height = widthFull * _defaultHeight / _defaultWidth;
        width = widthFull;
      }
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      _self.renderer.setSize(width, height);
    }
      
    function createRenderer (renderer){
      
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      container.addEventListener( 'resize', onWindowResize);
      container.addEventListener( 'pointerdown', onPointerDown, false );
      container.addEventListener( 'click', onPointerDown, false );
      container.addEventListener( 'mousemove', onPointerDown, false );
      window.addEventListener( 'keydown', onKeydown);
    }
  
    function update (scene) {
      const delta = clock.getDelta();
      mixers.forEach(x => x.update(delta));
      //
      var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
      var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
      var intersects = ray.intersectObjects( scene.children );
      if ( intersects.length > 0 ) {
          var obj = intersects[ 0 ].object;
          //obj.material.color.setHex( 0xffff00 );
      }
   }
  
   function start(renderer, scene) {
     renderer.setAnimationLoop(() => {
        update(scene);
        if(model && model.position.x  > -11 ) model.position.x -= 0.01;
      
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(scene, camera)
      });
   }
  
   function stop(renderer) { 
     renderer.setAnimationLoop(null);
   }
   
   function onKeydown (event) {
      
    const obj = plane; 
    //const obj = this.model; 
    
    switch ( event.keyCode ) {
        case 79: // O
            type  = 'O';
            break;
        case 76: // L
            type  = 'L';
            break;
        case 80: // P
            type  = 'P';
            break;
        case 77: // M    
            console.log(JSON.stringify({rotation: obj.rotation, scale: obj.scale, position: obj.position}));
            break;
    }
    
    if(type==="O")
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
    if(type==="L")
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
    if(type==="P")
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
    _self.renderer.render(_self.scene, camera);
   }
   
   function onPointerDown(event) {
          
        event.preventDefault();
        
        const fullScreen : boolean = mainScene.fullScreen;
        const heightFull = fullScreen ? window.innerHeight + 34 : window.innerHeight;
        let width = heightFull * _defaultWidth / _defaultHeight;
        let height = heightFull;
      
        if(width<container.clientWidth) {
          let widthFull = container.clientWidth;
          height = widthFull * _defaultHeight / _defaultWidth;
          width = widthFull;
        }
      
        //let width = container.clientWidth;
        //let heigth = container.clientHeigth;
        var rect = _self.renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX  - rect.left ) / width ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / height ) * 2 + 1;
        
        raycaster.setFromCamera( mouse, camera,  );
       
        const intersects = raycaster.intersectObjects( _self.scene.children, true );
        if ( intersects.length > 0 ) {
          if(objSel !== intersects[0].object) {
              if(objSel) {
                  objSel.material.color.setHex(objSel.currentHex);
              }
              objSel = intersects[0].object;
              objSel.currentHex = objSel.material.color.getHex();
              if(objSel.callback) {
                  objSel.material.color.setHex( 0xffff00 );
              }
          }
          
          let obj : any = null;
          obj = intersects[0].object;
          if(obj.callback) {
              
              document.body.style.cursor = 'pointer';
          
              if(event.type === "click") {
                  //let objSel = null;
                  //objSel.type = obj.callback.type;
				  //initialize(container, objSel, mainScene);
				  mainScene.onViewerMeeting();
                  
              }
          }
          else {
              if(event.type === "click") {
                  if(plane && plane.material && plane.material.currentHex) {
                      plane.material.color.setHex(plane.material.currentHex);
                  }
                  plane = intersects[0].object;
                  plane.material.color.setHex( 0xffff00 );
              }
          }
      } 
      else {
          document.body.style.cursor = 'default';
          if(objSel) {
              objSel.material.color.setHex(objSel.currentHex);
              objSel = null;
          }
      }
    }
   
    function createVideos (scene) {
        
      if(objScene && objScene.resources && objScene.resources.videos)
      objScene.resources.videos.forEach( (video, indx) => {
  
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
    
    function createPanel() {

		if(!mainScene.user || !mainScene.user.name ) return;
		
		const panel = new GUI( { width: 310 , autoPlace: false} );
		var customContainer = document.getElementById('gui');
        customContainer.appendChild(panel.domElement);

		const folder3 = panel.addFolder( 'Auditorio' );

		const panelSettings = {
			'Ingresar como': mainScene.user.aliasName
		};
		
		folder3.add( panelSettings, 'Ingresar como', '', '', '' ).onChange( function ( alias ) {
			mainScene.user.aliasName = alias;
		});
		folder3.open();
		
		var closeButton = <HTMLElement> document.querySelector('.close-button');
        closeButton.style.display = 'none';
	}

    let sizeBanners = 0;
    let bannersLoaded = 0;    
    
    function finishLoader() {
        bannersLoaded ++;
        if(bannersLoaded >= sizeBanners) {
           mainScene.onLoadingDismiss();
        }
    }
    
	function createBanners(scene){
      
      if(objScene && objScene.resources && objScene.resources.banners && objScene.resources.banners.length > 0) {
            sizeBanners = objScene.resources.banners.length;
            bannersLoaded = 0;     

            objScene.resources.banners.forEach( (banner, indx) => {
      
                const geometry = new THREE.PlaneGeometry( 5, 1, 1);
                  let material = null;
              
                if(banner.image_url) {
                  let texture: any = null;
                  texture = THREE.TextureLoader;
                  if(textures[banner.image_url]) {
                      texture = textures[banner.image_url];
                  }
                  else {
                      texture = new THREE.TextureLoader().load(banner.image_url,
                      function( texture ) {
                           // Success callback of TextureLoader
                           //texture.wrapS = THREE.RepeatWrapping;
                           //texture.wrapT = THREE.RepeatWrapping;
                           //texture.repeat.set( jsonMat.scaleu, jsonMat.scalev );
                           //var material = new THREE.MeshLambertMaterial({
                            //   map: texture,
                            //   side: THREE.DoubleSide,
                            //   name: jsonMat.mname
                           //});
                           //THREEMatList.push( material );
                           
                           // We're done, so tell the promise it is complete
                           material = new THREE.MeshBasicMaterial({ map: texture });
                           finishLoader();
                       },
                       function(){
                           finishLoader();
                       },
                       function(){
                           finishLoader();
                       }
                      );
                      textures[banner.image_url] = texture;
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
              
              plane.container = container;
              
              scene.add( plane );
      
            });          
        }
        else {
            finishLoader();
        }
    }
    
    function listenForFullScreenEvents() {
      window.addEventListener('map:fullscreenOff', (e:any) => {
        setTimeout(() => {
          mainScene.fullScreen = false;
          onWindowResize();
        }, 300);
      });
      window.addEventListener('map:fullscreenIn', (e:any) => {
        setTimeout(() => {
          mainScene.fullScreen = true;
          onWindowResize();
        }, 300);
      });
    }
    
    this.scene	= new THREE.Scene();
    createBackGround(this.scene);
    createCamera();
    createControls();
    createLight(this.scene);
    createRenderer(this.renderer);
    createBanners(this.scene);
    createVideos(this.scene);
    onWindowResize();
	createPanel();
    listenForFullScreenEvents();
    
    start(this.renderer, this.scene);
  }
  
  onDestroy() {
	while(this.scene.children.length > 0){ 
        this.scene.remove(this.scene.children[0]); 
    }
    this.renderer.dispose();
	THREE.Cache.clear();
  }
}

