import * as T from './libs/CS559-Three/build/three.module.js';

class Pillar {
    constructor(position = { x: 0, y: 0, z: 0 }, flickerDuration = 2000, proto = false) {
        this.x = position.x;
        this.y = position.y;
        this.z = position.z;
        let pillarLoader = new T.TextureLoader();
        let pillarTex = pillarLoader.load('./objects/pillar_tex.png');

        const geo = new T.CylinderGeometry(5, 5, 100, 32);
        let mat;

        if (proto) {
            mat = new T.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xfc0303,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.5
            });
        } else {
            mat = new T.MeshStandardMaterial({
            map: pillarTex,
            color: 0xffffff,
            emissive: 0xfc0303,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.5
            });
        }
        

        this.mesh = new T.Mesh(geo, mat);
        this.mesh.position.set(position.x, position.y, position.z);

        if (!proto) {
            //Upper point light
            this.light = new T.PointLight(0x8b4513, 10000,20);
            this.light.position.set(0,50,0);
            //Mid point light
            this.light2 = new T.PointLight(0x8b4513, 5000,30);
            this.light2.position.set(0,0,0);
            //Lower point light
            this.light3 = new T.PointLight(0x8b4513, 10000,20);
            this.light3.position.set(0,-50,0);


            this.mesh.add(this.light3);
            this.mesh.add(this.light2);
            this.mesh.add(this.light);
        }
        
        
        this.mesh.translateY(50); // Raise pillar so it sits on the ground

        // Set bounding box as nothing to begin with so we can't instantly 
        // collide with it 
        this.box = new T.Box3(new T.Vector3(), new T.Vector3());
        if (!proto) {
            this.flickerDuration = flickerDuration;
        } else {
            this.flickerDuration = 0;
        }
        
        this.startTime = Date.now();
        this.finished = false;
    }

    update() {
        if (!this.proto) {
            this.mesh.rotation.y += 0.01;
        }
        if (this.finished) return;

        const elapsed = Date.now() - this.startTime;
        

        if (elapsed < this.flickerDuration) {
            const pulse = Math.abs(Math.sin(elapsed / 100));
            this.mesh.material.opacity = pulse;
        } else {
            this.mesh.material.opacity = 1;

            //Make bounding box smaller than actual pillar
            this.box.setFromObject(this.mesh);
            this.box.expandByScalar(-3); // Shrink bounding box by 2 units

            this.finished = true;
        }
    }
}


export { Pillar };