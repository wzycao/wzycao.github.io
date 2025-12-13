import * as T from './libs/CS559-Three/build/three.module.js';

class Powerup {
    constructor(position = { x: 0, y: 0, z: 0 }) {

        this.x = position.x;
        this.y = position.y;
        this.z = position.z;

        // Cube Mesh
        const geo = new T.BoxGeometry(2, 2, 2);
        const mat = new T.MeshStandardMaterial({
            color: 0x00ffcc,
            emissive: 0x00ffcc,
            emissiveIntensity: 1.3
        });

        this.mesh = new T.Mesh(geo, mat);
        this.mesh.position.set(position.x, position.y, position.z);

        // Light inside cube
        this.light = new T.PointLight(0x00ffcc, 2000);
        this.mesh.add(this.light);              

        // Bounding box
        this.box = new T.Box3().setFromObject(this.mesh);

        this.time = 0;
    }


    update(dt) {
        // Update bounding box
        this.box.setFromObject(this.mesh);

        

        this.time += dt;
        const pulse = Math.abs(Math.sin(this.time));
        this.mesh.position.y = this.y + 3*pulse;
        this.mesh.material.emissiveIntensity = 1 + pulse * 2;
    }
}

export { Powerup };