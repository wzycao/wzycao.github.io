import * as T from './libs/CS559-Three/build/three.module.js';

class Pillar {
    constructor(position = { x: 0, y: 0, z: 0 }, flickerDuration = 2000) {
        this.x = position.x;
        this.y = position.y;
        this.z = position.z;

        const geo = new T.CylinderGeometry(5, 5, 100, 32);
        const mat = new T.MeshStandardMaterial({
            color: 0xfc0303,
            emissive: 0xfc0303,
            emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.5
        });

        this.mesh = new T.Mesh(geo, mat);
        this.mesh.position.set(position.x, position.y, position.z);

        this.light = new T.PointLight(0x8b4513, 10000,20);
        this.mesh.add(this.light);
        
        this.mesh.translateY(50); // Raise pillar so it sits on the ground

        // Set bounding box as nothing to begin with so we can't instantly 
        // collide with it 
        this.box = new T.Box3(new T.Vector3(), new T.Vector3());
        this.flickerDuration = flickerDuration;
        this.startTime = Date.now();
        this.finished = false;
    }

    update() {
        if (this.finished) return;

        const elapsed = Date.now() - this.startTime;

        if (elapsed < this.flickerDuration) {
            const pulse = Math.abs(Math.sin(elapsed / 100));
            this.mesh.material.opacity = pulse;
        } else {
            this.mesh.material.opacity = 1;
            this.box.setFromObject(this.mesh);
            this.finished = true;
        }
    }
}


export { Pillar };