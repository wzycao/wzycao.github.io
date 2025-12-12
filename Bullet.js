import * as T from './libs/CS559-Three/build/three.module.js';

class Bullet {
    constructor(side = 0, position = { x: 0, y: 0, z: 0 }) {

        this.x = position.x;
        this.y = position.y;
        this.z = position.z;


        // Cube Mesh
        const geo = new T.SphereGeometry(2);
        const mat = new T.MeshStandardMaterial({
            color: 0xfc0303,
            emissive: 0xfc0303,
            emissiveIntensity: 1.3
        });

        this.mesh = new T.Mesh(geo, mat);
        this.mesh.position.set(position.x, position.y, position.z);

        // Light inside cube
        this.light = new T.PointLight(0x00ffcc, 3, 10);
        this.mesh.add(this.light);              

        // Bounding box
        this.box = new T.Box3().setFromObject(this.mesh);

        this.time = 0;

        this.finished = false;

        this.speedX = 0;
        this.speedZ = 0;

        this.endX = 0;
        this.endZ = 0;

        switch(side) {
            case 0: //+X
                this.speedX = -0.5;
                this.endX = -10;
                break;
            case 1: //-X
                this.speedX = 0.5;
                this.endX = 10;
                break;
            case 2: //+Z
                this.speedZ = -0.5;
                this.endZ = -10;
                break;
            case 3: //-Z
                this.speedZ = 0.5;
                this.endZ = 10;
                break;        
        }
    }

    

    update(dt) {
        // travel in one direction based on initial side
        this.mesh.translateX(this.speedX);
        this.mesh.translateZ(this.speedZ);

        // Update bounding box
        this.box.setFromObject(this.mesh);


        //reached target side? delete object
        if ((this.endX != 0 && this.mesh.position.x == this.endX)  || (this.endZ !=0 && this.mesh.position.z == this.endZ)) {
            this.finished = true;
        }

        //replace with timer?

        this.time += dt;
        const pulse = (Math.sin(this.time * 3) + 1) * 0.5;
        this.mesh.material.emissiveIntensity = 1 + pulse * 0.8;
    }
}

export { Bullet };