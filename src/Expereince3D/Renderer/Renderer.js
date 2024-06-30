import * as THREE from 'three';
import Expereince3D from '../Expereince3D';

export default class Renderer {
    constructor() {
        this.expereince3D = new Expereince3D();
        this.canvas = this.expereince3D.canvas;
        this.sizes = this.expereince3D.sizes;
        this.camera = this.expereince3D.camera;
        this.scene = this.expereince3D.scene;

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });

        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setClearColor('#211d20');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
    }
}
