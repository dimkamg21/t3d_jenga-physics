import * as CANNON from 'cannon-es';
import PhysicsWorld from './PhysicsWorld';

export default class User {
    constructor() {
        this.physicWorld = new PhysicsWorld();
        this.world = this.physicWorld.instance;
        this.defaultMaterial = this.world.defaultMaterial

        this.setInstance();     
    }

    setInstance() {
        this.radius = 0.5;
        this.sphereShape = new CANNON.Sphere(this.radius);
        this.sphereBody = new CANNON.Body({ mass: 5, material: this.defaultMaterial })
        this.sphereBody.addShape(this.sphereShape);
        this.sphereBody.position.set(0, 3, 3);
        this.sphereBody.linearDamping = 0.9;
        this.sphereBody.angularDamping = 0.99;

        this.world.addBody(this.sphereBody);
    }
}
