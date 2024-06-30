import * as THREE from 'three';
import Experience3D from '../Expereince3D';

export default class Camera {
    constructor() {
        this.experience = new Experience3D();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            75, this.sizes.width / this.sizes.height, 0.1, 1000
        );
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
}
