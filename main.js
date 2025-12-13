import * as T from './libs/CS559-Three/build/three.module.js';
import { OBJLoader } from './libs/CS559-Three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from "./libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
import { Powerup } from './Powerup.js';
import { Bullet } from './Bullet.js';
import { Pillar } from './Pillar.js';

/**
 * Intialize html elements
 * 
 */

let sceneActive = false;
let optionsMenu = false;
document.getElementById('controls-menu').style.display = 'none';
document.getElementById('ui').style.display = 'none';
document.getElementById('info-menu').style.display = 'none';
document.getElementById('gameover').style.display = 'none';

let upKey = "w";
let downKey = "s";
let leftKey = "a";
let rightKey = "d";

let strLKey = "q";
let strRKey = "e";

let slowKey = "shift";
let altKey = "alt";

/**
 * Display variables
 */
const speedUI = document.querySelector("#speed");
const pointsUI = document.querySelector("#points");
const grazeUI = document.querySelector("#graze");

const controls = {
  w: false,
  s: false,
  a: false,
  d: false,

  q: false,
  e: false,

  shift: false,
  alt: false
};

// do later :)
function changeControls() {

}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (controls.hasOwnProperty(key)) {
    e.preventDefault();
    controls[key] = true;
  }
  
});
window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (controls.hasOwnProperty(key)) {
    e.preventDefault();
    controls[key] = false;
  }
  
});




/**
 * Intialize THREE.js elements
 * 
 */
const scene = new T.Scene();



const camera = new T.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1500 );

const renderer = new T.WebGLRenderer();

const textureLoader = new T.TextureLoader();
const skyboxTexture = textureLoader.load('./objects/SpaceSkybox.png');
const skyboxGeometry = new T.SphereGeometry(900, 32, 32);
const skyboxMaterial = new T.MeshBasicMaterial({ map: skyboxTexture, side: T.BackSide, 
  color:0x303030});
const skybox = new T.Mesh(skyboxGeometry, skyboxMaterial);

scene.add(skybox);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// //Debugging camera
// const debug_camera = new T.PerspectiveCamera(90);
// debug_camera.position.set(10, 10, 10);  // place it somewhere sensible

// // Add orbit controls for debugging camera
// const debugControls = new OrbitControls(debug_camera, renderer.domElement);
// debugControls.enableDamping = false; 
// debugControls.dampingFactor = 0.05;
// debugControls.target.set(0, 0, 0);

//Main light source 
const light = new T.HemisphereLight( 0xffe57d, 0x6e6d6a, 1 );
scene.add(light);



/**
 * Objects
 * 
 */

// Anchor point
const geometry = new T.BoxGeometry( 0.1, 0.1, 0.1 );

//Ground Object
const texLoad = new T.TextureLoader();
const meteorText = texLoad.load('./objects/Solarsystemscope_texture_8k_saturn.jpg');

const meteorMat = new T.MeshPhongMaterial({map: meteorText,
                                          color:0x7a7a7a,
                                          emissive:0x7a7a7a,
                                          emissiveIntensity:0.2});
const meteorGeom = new T.CylinderGeometry(200,200,50);
const meteorMesh = new T.Mesh(meteorGeom,meteorMat);
meteorMesh.translateY(-27);

const meteorLight = new T.PointLight(0x7a7a7a,500);
meteorMesh.add(meteorLight);
scene.add(meteorMesh);


//Fully transparent material we will use later for bounding boxes
const wireframeMat = new T.MeshStandardMaterial({opacity: 0.0, transparent: true});
const cube = new T.Mesh( geometry, wireframeMat );
// const axesHelper = new T.AxesHelper(4); 
cube.position.set(0,5,0);
// cube.add(axesHelper);
scene.add( cube );
cube.add(camera);

// Light from player
cube.add(new T.PointLight(0xffffff, 2.5, 50));


camera.position.set(0,3,20);


/**
 * Main Character
 * 
 */
let loader = new OBJLoader();

let manMat = new T.MeshPhongMaterial({
      color: 0xffdead,
      specular: 0xd08686,
      shininess: 30
    });

let bowMat = new T.MeshPhongMaterial({
      color: 0xc1258f,
      specular: 0xd08686,
      shininess: 30
    });

let main_man = await loader.loadAsync("./objects/FinalBaseMesh.obj");

main_man.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = manMat;
        }
    });

main_man.scale.set(0.25,0.25,0.25);
main_man.position.set(0,-0.6,3);
cube.add(main_man);

// bow to make him sliiightly resemble a touhou character

let bow = await loader.loadAsync("./objects/19331_Bow_v1.obj");

bow.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = bowMat;
        }
    });

bow.position.set(0,20,-1.5);
main_man.add(bow);


//Bounding Box 2 (Inner)
const geometry2 = new T.BoxGeometry( 2, 15, 1.5 );
const cube2 = new T.Mesh( geometry2, wireframeMat );
cube2.position.set(0,10,0);
main_man.add(cube2);


// create an AudioListener and add it to the camera
const listener = new T.AudioListener();
camera.add( listener );

/**
 * Audio Loading
 * 
 */
const music = new T.Audio( listener );
const grazeSound = new T.Audio( listener );
const deathSound = new T.Audio( listener );
const pickupPowerup = new T.Audio( listener);

const audioLoader = new T.AudioLoader();

audioLoader.load( 'sounds/graze.wav', function( buffer ) {
	grazeSound.setBuffer( buffer );
	grazeSound.setLoop( false );
	grazeSound.setVolume( 0.5 );
});

audioLoader.load( 'sounds/pldead00.wav', function( buffer ) {
	deathSound.setBuffer( buffer );
	deathSound.setLoop( false );
	deathSound.setVolume( 0.5 );
});

audioLoader.load( 'sounds/kira01.wav', function( buffer ) {
	pickupPowerup.setBuffer( buffer );
	pickupPowerup.setLoop( false );
	pickupPowerup.setVolume( 0.5 );
});

audioLoader.load( 'sounds/A Soul as Red as a Ground Cherry.mp3', function( buffer ) {
	music.setBuffer( buffer );
	music.setLoop( true );
	music.setVolume( 0.125 );
});


/**
 * Variables for main loop
 * 
 */
//Control Variables
let gameEnded = false; 

//Player Variables
let rotVel = 0;
let upVel = 0;
let strVel = 0;
let charRotX = 0;
let charRotZ = 0;
let charRotY = 0;

let rotSpeed = 0.001;
let upSpeed = 0.015;
let strSpeed = 0.015;
let fwdSpeed = -0.1;
let dispSpeed = 0;

//Score Variables
let graze = 0;
let points = 0;
let score = 0;

//Doing this method of setting boxes creates a best-guess instead of a perfectly aligned box, which works for now
let innerCollisionBox = new T.Box3().setFromObject(cube2);
let outerCollisionBox = new T.Box3();


// // Debug to show hitboxes

// let debug = new T.Group();

// let debugBox1 = new T.Box3Helper(innerCollisionBox);
// let debugBox2 = new T.Box3Helper(outerCollisionBox);

// debug.add(debugBox1);
// debug.add(debugBox2);

// scene.add(debug);


//Powerup group
let powerups = new T.Group();

//Bullet group
let boolats = new T.Group();

//Pillar group
let pillars = new T.Group();

scene.add(pillars);
scene.add(powerups);
scene.add(boolats);

//Add some powerups to begin with
let p1 = new Powerup({ x: 40, y: 15, z: 0 });
let p2 = new Powerup({ x: -20, y: 1, z: 15 });

// Add them to the group
powerups.add(p1.mesh);
powerups.add(p2.mesh);

// Also store references so you can update them
let powerup_objects = [p1, p2];
let bullet_objects = [];
let pillar_objects = [];




/**
 * Powerup and Bullet Spawns
 * 
 */

function spawnPowerup(time) {
    // use time to produce deterministic random x/z
    const x = Math.sin(time*1000) * 125;
    const y = Math.abs(Math.random() * 100);
    const z = Math.sin(time/500) * 125;

    let p = new Powerup({ x, y, z });
    
    powerups.add(p.mesh);
    powerup_objects.push(p);
}

function spawnBullet(time) {
    //spawn bullet on either max X (+/-) or max Z (+/-)
    //randomize other element
    const side = Math.floor(Math.random() * 4);
    let x, y, z;
    y = Math.abs(Math.random() * 100); //random Y between 0 and 100
    switch(side) {
        case 0: // +X side
            x = 150;
            z = (Math.random() - 0.5) * 300;
            break;
        case 1: // -X side
            x = -150;
            z = (Math.random() - 0.5) * 300;
            break;
        case 2: // +Z side
            z = 150;
            x = (Math.random() - 0.5) * 300;
            break;
        case 3: // -Z side
            z = -150;
            x = (Math.random() - 0.5) * 300;
            break;
    } 

    let b = new Bullet(side, { x, y, z });

    
    boolats.add(b.mesh);
    bullet_objects.push(b);
}



  // Function to spawn pillars
  function spawnPillar(time) {
      const x = Math.sin(time * 1234) * 125;
      const y = 0; // Ground level
      const z = Math.cos(time * 10) * 125;

      const pillar = new Pillar({x, y, z});

      pillars.add(pillar.mesh);
      pillar_objects.push(pillar);
  }



/**
 * Main animation loop
 * 
 */
let lastTimestamp; // undefined to start

function animate(timestamp) {

  // Convert time change from milliseconds to seconds
  let timeDelta = 0.001 * (lastTimestamp ? timestamp - lastTimestamp : 0);
  lastTimestamp = timestamp;

  // animate background objects
  meteorMesh.rotation.y += 0.01 * timeDelta;
  skybox.rotation.z += 0.01 * timeDelta;
  skybox.rotation.x += 0.01 * timeDelta;
  
  // Rotate camera 180 degrees if alt key is pressed
  if (controls[altKey]) {
    camera.position.set(0,3,-20);
    camera.rotation.y = Math.PI;
  } else {
    camera.position.set(0,3,20);
    camera.rotation.y = 0;
  }

  /**
   * Main character stuff
   * 
   */

  //Main character Controls
  if (controls[leftKey]) {
    rotVel += rotSpeed;
  }

  if (controls[rightKey]) {
    rotVel -= rotSpeed;
  }

  if (controls[upKey]) {
    upVel += upSpeed;
  }

  if (controls[downKey]) {
    upVel -= upSpeed;
  }


  if (controls[strLKey]) {
    strVel -= strSpeed;
  }

  if (controls[strRKey]) {
    strVel += strSpeed;
  }

  //Cap rotation and velocity
  //clamp functions. you can mess around with max and min values to make piloting 'feel' better
  let maxSpeed = -fwdSpeed;
  let minSpeed = fwdSpeed;
  rotVel = Math.min(Math.max(rotVel, -0.03), 0.03);
  upVel = Math.min(Math.max(upVel, minSpeed), maxSpeed);
  strVel = Math.min(Math.max(strVel, minSpeed), maxSpeed);

  // add velocities to cube
  cube.rotation.y += rotVel;
  cube.position.y += upVel;
  cube.translateX(strVel);

  //this is to make velocity eventually return to 0. This makes the movement feel a little bit more slippery (you won't stop turning or moving 
  //instantly), but this seems better than just being able to control your motion entirely as it appears more smooth. 
  //For a touhou-like this isn't ideal tho
  rotVel *= 0.95;
  upVel *= 0.95;
  strVel *= 0.95;

  // this code sucks really bad, but if you change rotation and up values 
  // remember to change the multipliers here
  
  charRotX = 2*upVel;
  charRotY = 50*rotVel;
  charRotZ = 10*rotVel;
  //The intial values were calculated from guess-and-checking the model to see what rotation looked good
  main_man.rotation.set(1.75 + charRotX,0 + charRotY,3.13 - charRotZ );


  //Makes the player always moving forward
  //Can comment out for debugging
  if (controls[slowKey]) {
    cube.translateZ(0.3*fwdSpeed);
  } else {
    
    cube.translateZ(fwdSpeed);
  }

  //Slowly speed up over time
  fwdSpeed -= (0.005 * timeDelta);
  
  //Update collision boxes for main character
  innerCollisionBox.setFromObject(cube2);
  outerCollisionBox.setFromObject(main_man);
  outerCollisionBox.expandByScalar(2.5);

  //Check if you go out of bounds
  if (Math.abs(cube.position.x) >= 300 || Math.abs(cube.position.z) >= 300
  || cube.position.y >= 200) {
    endGame("You went flying into the distant stars!");
  }

  // check if you go into the ground
  if (cube.position.y <= -2) {
    endGame("You went crashing into the planet!");
  }

  /**
   * Bullet & Powerup Stuff
   * 
   */

  // Make sure these spawn rates are based on delta time so computer tickrate does not impact them (more lag)
  if (Math.random() < timeDelta * 0.09) {
      spawnPowerup(timestamp);
  }

  if (Math.random() < timeDelta * 0.09) {
      console.log('Bullet spawned');
      spawnBullet(timestamp);
  }

  if (Math.random() < timeDelta * 0.06) {
      console.log("Pillar spawned");
      spawnPillar(timestamp);
  }

  powerup_objects.forEach((p, i) => {
        p.update(timeDelta);
        if (p.box.intersectsBox(innerCollisionBox)) {
            console.log("Collected powerup:", i);
            //For now powerup just adds to your score, but
            //can add more stuff later
            points++;

            pickupPowerup.play(0);

            // Remove from group AND from scene
            powerups.remove(p.mesh);

            powerup_objects.splice(i, 1);
        }
    });

bullet_objects.forEach((b, i) => {
        b.update(timeDelta);

        if (b.finished) {
            // Remove bullets that have finished their travel
            console.log("Bullet Removed!");
            boolats.remove(b.mesh);
            bullet_objects.splice(i, 1);
        } else if (b.box.intersectsBox(innerCollisionBox)) {
            console.log("Hit by bullet:", i);
            
            endGame("You ran into a bullet!");
            boolats.remove(b.mesh);
            bullet_objects.splice(i, 1);
        } else if (b.box.intersectsBox(outerCollisionBox)) {
            grazeSound.play(0);
            console.log("Grazed by bullet:", i);
            graze += 0.1;
        } 
        
    });    
  
pillar_objects.forEach((p, i) => {
    p.update(timeDelta);

    if (p.box.intersectsBox(innerCollisionBox)) {
      console.log("Hit by pillar:", i);
      pillars.remove(p.mesh);
      pillar_objects.splice(i, 1);
      
      endGame("You ran straight into a pillar!");
      
    } else if (p.box.intersectsBox(outerCollisionBox)) {
      console.log("Grazed by pillar:", i);
      grazeSound.play(0);
      graze += 0.1;
    } 

  });



  //Display current speed as a rounded integer
  //Here, we could think of using the math.floor thing to instead display something fancier than just a number (a bar?)
  dispSpeed = Math.floor(-7*fwdSpeed);

  speedUI.textContent = dispSpeed;
  pointsUI.textContent = points;
  grazeUI.textContent = Math.floor(graze);

  if (!gameEnded) {
    //Replace camera with debug_camera for debugging
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}

// place requestAnimationFrame(animate); here for easy debug (graphics will always be showing)
// requestAnimationFrame(animate);

/**
 * This function will be called whenever a game-ending scenario occurs
 */
function endGame(message = "Game Over!") {
    music.stop();
    deathSound.play(0);
    //Put transparent black quad right in front of screen to simulate fade-out
    let fadeScreen = document.createElement("div");
    fadeScreen.style.position = "fixed";
    fadeScreen.style.top = "0";
    fadeScreen.style.left = "0";
    fadeScreen.style.width = "100%";
    fadeScreen.style.height = "100%";
    fadeScreen.style.backgroundColor = "black";
    fadeScreen.style.opacity = "0.25";
    fadeScreen.style.zIndex = "9999";
    //add fadeScreen to div after gameover text so it is behind text
    document.body.appendChild(fadeScreen);

    document.getElementById('ui').style.display = 'none';

    gameEnded = true;
    document.getElementById('gameover').style.display = 'inline-flex';
    document.getElementById('gameovertext').textContent = message;

    //Calculate score
    //100% points + 50% graze
    score = Math.floor(points + (graze * 0.5)); 
    document.getElementById('score').textContent = score
}

/**
 * Main menu buttons
 * 
 */

document.getElementById('start').addEventListener('click', () => {
        if (!sceneActive) {
            requestAnimationFrame(animate);
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('ui').style.display = 'inline-flex';
            music.play();
            sceneActive = true;
        }
});

let fuckyou = false; 


//Two menus, only one can be visible at a time

document.getElementById('controls').addEventListener('click', () => {

        if (fuckyou) {
          fuckyou = !fuckyou;
          document.getElementById('info-menu').style.display = 'none';
        } 

        optionsMenu = !optionsMenu;
        if (optionsMenu) {
            document.getElementById('controls-menu').style.display = 'block';
        } else {
          document.getElementById('controls-menu').style.display = 'none';
        }
});



document.getElementById('info').addEventListener('click', () => {

        if (optionsMenu) {
          optionsMenu = !optionsMenu;
          document.getElementById('controls-menu').style.display = 'none';
        }   

        fuckyou = !fuckyou;
        if (fuckyou) {
            document.getElementById('info-menu').style.display = 'block';
        } else {
          document.getElementById('info-menu').style.display = 'none';
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
