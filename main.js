import * as T from './libs/CS559-Three/build/three.module.js';


const scene = new T.Scene();
const camera = new T.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new T.WebGLRenderer();
scene.fog = new T.Fog(0x87ceeb, 1, 500);
const gridHelper = new T.GridHelper(500, 50); // 500 units wide, 50 subdivisions
scene.add(gridHelper);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//Replace cube with either a collision box or point (which will be used to generate other stuff like the model)
const geometry = new T.BoxGeometry( 1, 1, 1 );
const material = new T.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new T.Mesh( geometry, material );
const axesHelper = new T.AxesHelper(4); 
cube.add(axesHelper);
scene.add( cube );

const controls = {
  w: false,
  a: false,
  s: false,
  d: false,
  q: false,
  e: false,
};


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


cube.add(camera);
camera.position.set(0,5,10);



let rotVel = 0;
let upVel = 0;

let rotSpeed = 0.05;
let upSpeed = 0.015;
let fwdSpeed = -0.09;

function animate() {
  requestAnimationFrame(animate);

  // Controls
  if (controls.a) {
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

  rotVel *= 0.96;
  upVel *= 0.96;



  cube.translateZ(fwdSpeed);
   
  renderer.render( scene, camera);
}
requestAnimationFrame(animate);



/* event listeners
 *
 *
 * 
 */
window.addEventListener("resize", () => { 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
