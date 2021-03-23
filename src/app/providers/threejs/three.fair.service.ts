import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {  GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ThreeFairService {

  constructor() {
     
  }
  

  // INITIALIZATION
  initialize = (container: HTMLElement, objScene:any, mainScene: any, objListener: string) => {
    
    let aspect: number;
    let camera: THREE.PerspectiveCamera;
    let controls: OrbitControls;
    let hemisphere: THREE.HemisphereLight;
    let mainLight: THREE.DirectionalLight;
    let scene: THREE.Scene;
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
    let gammaOutput = false;
    let near = 1;
    let physicallyCorrectLights = false;
  
    let renderer = new THREE.WebGLRenderer({ antialias: true });
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
    function createLight() {
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
	function createModels() {
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
  
    // RENDERER
    function onWindowResize() {
		
	  const fullScreen : boolean = mainScene.fullScreen;
  	  const heightFull = fullScreen ? window.innerHeight + 34 : window.innerHeight;
      let width = heightFull * 1079 / 544;
      let height = heightFull;
  	
      if(width<container.clientWidth) {
        let widthFull = container.clientWidth;
        height = widthFull * 544 / 1079;
        width = widthFull;
      }
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    }
      
    function createRenderer (){
      
      renderer.setPixelRatio(window.devicePixelRatio);  
  
      renderer.gammaFactor = gammaFactor;
      //renderer.gammaOutput = true;
      renderer.physicallyCorrectLights = true;
  
      container.appendChild(renderer.domElement);
      window.addEventListener( 'resize', onWindowResize);
      window.addEventListener( 'pointerdown', onPointerDown, false );
      window.addEventListener( 'click', onPointerDown, false );
      window.addEventListener( 'mousemove', onPointerDown, false );
	  window.addEventListener( 'keydown', onKeydown);
      
    }
  
    function update () {
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
  
   function start() {
	 renderer.setAnimationLoop(() => {
        update();
        if(model && model.position.x  > -11 ) model.position.x -= 0.01;
      
        renderer.autoClear = false;
        renderer.clear();
        renderer.render(scene, camera)
      });
   }
  
   function stop() { 
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
    renderer.render(scene, camera);
   }
   
   function onPointerDown(event) {
          
        event.preventDefault();
		
		const fullScreen : boolean = mainScene.fullScreen;
  	    const heightFull = fullScreen ? window.innerHeight + 34 : window.innerHeight;
        let width = heightFull * 1079 / 544;
        let height = heightFull;
  	
        if(width<container.clientWidth) {
          let widthFull = container.clientWidth;
          height = widthFull * 544 / 1079;
          width = widthFull;
        }
      
	    //let width = container.clientWidth;
		//let heigth = container.clientHeigth;
        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX  - rect.left ) / width ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / height ) * 2 + 1;
        
        raycaster.setFromCamera( mouse, camera,  );
       
        const intersects = raycaster.intersectObjects( scene.children, true );
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
          if(obj.callbacktempasdfasdf) {
              
              document.body.style.cursor = 'pointer';
          
              if(event.type === "click") {
                  //let objSel = null;
                  //
                  //
                  //objSel.type = obj.callback.type;
                  //initialize(container, objSel, mainScene);
                  
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
   
    function createVideos () {
        
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
          scene.add(movieScreen); */
      });
    }
    
    function createBanners (){
        
      if(objScene && objScene.resources && objScene.resources.banners)
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
                  texture = new THREE.TextureLoader().load(banner.image_url);
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
                  scene.add( _text );
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
    
	function listenForFullScreenEvents() {
      window.addEventListener(objListener+':fullscreenOff', (e:any) => {
        setTimeout(() => {
          mainScene.fullScreen = false;
          onWindowResize();
        }, 300);
      });
      window.addEventListener(objListener+':fullscreenIn', (e:any) => {
        setTimeout(() => {
          mainScene.fullScreen = true;
          onWindowResize();
        }, 300);
      });
    }
	
    scene = new THREE.Scene();
	objScene = objScene;
    createCamera();
    createControls();
    createLight();
    createRenderer();
    createBanners();
    createVideos();
	onWindowResize();
	listenForFullScreenEvents();
	
    let texture = null;
    if(textures[objScene.resources.url_image]) {
        texture = textures[objScene.resources.url_image];
        if(mainScene.setLoading) mainScene.setLoading(false);
    }
    else {
        texture = new THREE.TextureLoader().load(objScene.resources.url_image, ()=>{
            if(mainScene.setLoading) mainScene.setLoading(false);
        });
        textures[objScene.resources.url_image] = texture;
    }
    
    //const sceneBackground = 0x8fbcd4;
    //scene.background = new Color(sceneBackground);
    scene.background = texture;

    start();
  }
  
}
