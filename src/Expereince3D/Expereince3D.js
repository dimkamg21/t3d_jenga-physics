import * as THREE from 'three';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera/Camera';
import Renderer from './Renderer/Renderer';
import Resources from './Utils/Resources';
import World from './World/World';
import source from './source';

let instance = null;

export default class Expereince3D {
    constructor(canvas) {
        if (instance) {
            return instance;
        }

        instance = this;

         // Options
         this.canvas = canvas;
         this.scene = new THREE.Scene();
         this.scene.fog = new THREE.Fog(0x000000, 0, 500)
         this.sizes = new Sizes();
         this.time = new Time();
         this.camera = new Camera();
         this.resources = new Resources(source);
         this.renderer = new Renderer();
         this.world = new World();

         // Resize event
         this.sizes.on('resize', () => {
            this.resizes();
         });

         //tick event
         this.time.on('tick', () => {
            this.update();
         });
    }

    resizes() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.renderer.update();
        this.world.update(this.time.delta);
    }
}
