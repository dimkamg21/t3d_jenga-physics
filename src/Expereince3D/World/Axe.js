import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Expereince3D from '../Expereince3D';

export default class Axe {
    constructor() {
        this.experience3D = new Expereince3D();
        this.resources = this.experience3D.resources;
        this.scene = this.experience3D.scene;

        this.resource = this.resources.items.axe; 
        this.axe = this.resource.scene.clone();

        this.axe.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        const axeHalfExtents = new CANNON.Vec3(0.025, 0.324, 0.083);
        this.axeShape = new CANNON.Box(axeHalfExtents);
        this.axeBody = new CANNON.Body({ mass: 2 });
        this.axeBody.addShape(this.axeShape);

        this.scene.add(this.axe);
    }

    getAxeBody() {
        return this.axeBody;
    }

    getAxeMesh() {
        return this.axe;
    }
}
