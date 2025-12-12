import * as T from './libs/CS559-Three/build/three.module.js';

class Bullet {
    constructor(position = { x: 0, y: 0, z: 0 }) {

        this.x = position.x;
        this.y = position.y;
        this.z = position.z;


        // Cube Mesh
        const geo = new T.SphereGeometry(2, 3, 2);
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
    }

    

    update(dt) {
        // Update bounding box
        this.box.setFromObject(this.mesh);

        // Optional glowing animation
        this.time += dt;
        const pulse = (Math.sin(this.time * 3) + 1) * 0.5;
        this.mesh.material.emissiveIntensity = 1 + pulse * 0.8;
    }
}

export { Bullet };