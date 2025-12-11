import * as T from './libs/CS559-Three/build/three.module.js';
import { OBJLoader } from './libs/CS559-Three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";


/**
 * Intialize html elements
 * 
 */

let sceneActive = false;
let optionsMenu = false;
document.getElementById('controls-menu').style.display = 'none';
document.getElementById('ui').style.display = 'none';

let upKey = "w";
let downKey = "s";
let leftKey = "a";
let rightKey = "d";

let accelKey = "q";
let decelKey = "e";


/**
 * Display variables
 */
const speedUI = document.querySelector("#speed");


const controls = {
  w: false,
  s: false,
  a: false,
  d: false,

  q: false,
  e: false
};

// do later :)
function changeControls() {

}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (controls.hasOwnProperty(key))
  controls[key] = true;
});
window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (controls.hasOwnProperty(key))
  controls[key] = false;
});




/**
 * Intialize THREE.js elements
 * 
 */
const scene = new T.Scene();



const camera = new T.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new T.WebGLRenderer();
scene.fog = new T.Fog(0x87ceeb, 1, 500);
const gridHelper = new T.GridHelper(500, 50); // 500 units wide, 50 subdivisions
scene.add(gridHelper);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Debugging camera
const debug_camera = new T.PerspectiveCamera();
let debug_controls = new OrbitControls(debug_camera, renderer.domElement);
scene.add(debug_camera);
//Main light source 
const light = new T.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add(light);





//Objects

//Replace cube with either a collision box or point (which will be used to generate other stuff like the model)
const geometry = new T.BoxGeometry( 0.1, 0.1, 0.1 );
const material = new T.MeshStandardMaterial();
const cube = new T.Mesh( geometry, material );
const axesHelper = new T.AxesHelper(4); 
cube.add(axesHelper);
scene.add( cube );
cube.add(camera);


//Bounding Box 1
const geometry1 = new T.BoxGeometry( 4, 4, 5 );
const wireframeMat = new T.MeshStandardMaterial({wireframe:true});
const cube1 = new T.Mesh( geometry1, wireframeMat );
cube.add(cube1);

//Bounding Box 2
const geometry2 = new T.BoxGeometry( 2, 2, 4.5 );
const cube2 = new T.Mesh( geometry2, wireframeMat );
cube1.add(cube2);


camera.position.set(0,5,10);


let loader = new OBJLoader();

let manMat = new T.MeshPhongMaterial({
      color: "#888888",
      shininess: 50
    });

let main_man = await loader.loadAsync("./objects/FinalBaseMesh.obj");

main_man.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = manMat;
        }
    });

main_man.scale.set(0.25,0.25,0.25);
main_man.position.set(0,-0.8,3);
main_man.rotation.set(2,0,3.13);
cube.add(main_man);



let rotVel = 0;
let upVel = 0;
let charRotX = 0;
let charRotZ = 0;
let charRotY = 0;

let rotSpeed = 0.001;
let upSpeed = 0.015;
let fwdSpeed = -0.09;
let dispSpeed = 0;

renderer.render(scene, debug_camera);

/**
 * Main animation loop
 * 
 */

function animate() {
  
  // Controls
  if (controls[leftKey]) {
    rotVel += rotSpeed;
  }

  if (controls.d) {
    rotVel -= rotSpeed;
  }

  if (controls.w) {
    upVel += upSpeed;
  }

  if (controls.s) {
    upVel -= upSpeed;
  }

  if (controls.q) {
    fwdSpeed -= 0.001;
  }

  if (controls.e) {
    fwdSpeed += 0.001;
    if (fwdSpeed >= -0.1) {
      fwdSpeed = -0.1;
    }
  }

  //Cap rotation and velocity
  //clamp functions. you can mess around with max and min values to make piloting 'feel' better

  rotVel = Math.min(Math.max(rotVel, -0.01), 0.01);
  upVel = Math.min(Math.max(upVel, -0.1), 0.1);


  // add velocities
  cube.rotation.y += rotVel;
  cube.position.y += upVel;
  //this is to make velocity eventually return to 0. This makes the movement feel a little bit more slippery (you won't stop turning or moving 
  //instantly), but this actually seems better than just being able to control your motion entirely
  rotVel *= 0.95;
  upVel *= 0.96;

  // this sucks really bad, but if you change rotation and up values 
  // remember to change the multipliers here
  
  charRotX = 2*upVel;
  charRotY = 50*rotVel;
  charRotZ = 10*rotVel;
  main_man.rotation.set(1.8 + charRotX,0 + charRotY,3.13 - charRotZ );
  cube1.rotation.set( charRotX,0.5*charRotY,2*charRotZ)


  // comment out translateZ here for debug
  //cube.translateZ(fwdSpeed);


  //Display current speed as a rounded integer
  //Here, we could think of using the math.floor thing to instead display something fancier than just a number (a bar?)
  dispSpeed = Math.floor(-7*fwdSpeed);

  speedUI.textContent = dispSpeed;
  renderer.render(scene, debug_camera);
  requestAnimationFrame(animate);
}
// place requestAnimationFrame(animate); here for easy debug (graphics will always be showing)
requestAnimationFrame(animate);



/**
 * Main menu buttons
 * 
 */

document.getElementById('start').addEventListener('click', () => {
        if (!sceneActive) {
            requestAnimationFrame(animate);
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('ui').style.display = 'inline-flex';
            sceneActive = true;
        }
});

document.getElementById('controls').addEventListener('click', () => {
        optionsMenu = !optionsMenu;
        if (optionsMenu) {
            document.getElementById('controls-menu').style.display = 'block';
        } else {
          document.getElementById('controls-menu').style.display = 'none';
        }
});




/**
 * event listeners
 * 
 */
window.addEventListener("resize", () => { 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
