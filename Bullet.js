import * as T from './libs/CS559-Three/build/three.module.js';

class Bullet {
    constructor(side = 0, position = { x: 0, y: 0, z: 0 }, proto = false) {

        this.x = position.x;
        this.y = position.y;
        this.z = position.z;
        this.timer = 10;
        

        const textureLoader = new T.TextureLoader();
        const bulletTexture = textureLoader.load('./objects/basic_texture.png');

        // Cube Mesh
        const geo = new T.SphereGeometry(5);
        let mat;

        if (proto) {
            mat = new T.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xff2626,
            emissiveIntensity: 1.3
            });

        } else {
            mat = new T.MeshStandardMaterial({
            map: bulletTexture,
            color: 0xffffff,
            emissive: 0xff2626,
            emissiveIntensity: 1.3
            });

        }
       
        this.mesh = new T.Mesh(geo, mat);
        this.mesh.position.set(position.x, position.y, position.z);

        if (!proto) {
            // Light inside cube
            this.light = new T.PointLight(0xff2626, 500);
            this.mesh.add(this.light);
        }
                      
        // Bounding box
        this.box = new T.Box3().setFromObject(this.mesh);

        this.time = 0;

        this.finished = false;

        this.speedX = 0;
        this.speedZ = 0;

        this.proto = proto;

        switch(side) {
            case 0: //+X
                this.speedX = -0.8;
                break;
            case 1: //-X
                this.speedX = 0.8;
                break;
            case 2: //+Z
                this.speedZ = -0.8;
                break;
            case 3: //-Z
                this.speedZ = 0.8;
                break;        
        }
    }

    

    update(dt) {
        // travel in one direction based on initial side
        this.mesh.translateX(this.speedX);
        this.mesh.translateZ(this.speedZ);

        // Update bounding box
        this.box.setFromObject(this.mesh);


        // reached timer? delete object
        this.timer -= dt;
        if (this.timer <= 0) {
            console.log('Bullet Timeout!');
            this.finished = true;
        }

        this.time += dt;
        const pulse = (Math.sin(this.time * 3) + 1) * 0.5;
        if (!this.proto) {
            this.mesh.material.emissiveIntensity = 1 + pulse * 0.8;
        }
    }
}

export { Bullet };