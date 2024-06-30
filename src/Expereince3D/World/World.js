import * as THREE from 'three';
import Axe from './Axe';
import User from './User';
import Jenga from './Jenga';
import Floor from './Floor';
import Environment from './Environment';
import PhysicsWorld from './PhysicsWorld';
import Expereince3D from '../Expereince3D';
import { PointerLockControlsCannon } from '../Utils/PointerLockControlsCannon';

const instructions = document.getElementById('instructions');

export default class World {
    constructor() {
        this.experience3D = new Expereince3D();
        this.camera = this.experience3D.camera;
        this.scene = this.experience3D.scene;
        this.physicsWorldInstance = new PhysicsWorld();
        this.physicsWorld = this.physicsWorldInstance.instance;

        // Setup
        this.resources = this.experience3D.resources;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.environment = new Environment();
            this.floor = new Floor();
            this.jenga = new Jenga();

            this.user = new User();
            this.userBody = this.user.sphereBody;

            this.initPointerLock();
            this.shootTheAxe();
        });
    }

    shootTheAxe() {
        this.axesMesh = [];
        this.axesBody = [];

        const shootVelocity = 15;

        window.addEventListener('click', (event) => {
            if (!this.controls.enabled) {
                return;
            }

            const axe = new Axe();

            const axeBody = axe.getAxeBody();
            const axeMesh = axe.axe;

            this.physicsWorld.addBody(axeBody);

            this.axesBody.push(axeBody);
            this.axesMesh.push(axeMesh);

            const shootDirection = this.getShootDirection();
            axeBody.velocity.set(
                shootDirection.x * shootVelocity,
                shootDirection.y * shootVelocity,
                shootDirection.z * shootVelocity
            );

            // Move the axe outside the player sphere
            const x = this.userBody.position.x + shootDirection.x * (this.user.sphereShape.radius * 1.2 + axeBody.shapes[0].halfExtents.x)
            const y = this.userBody.position.y + shootDirection.y * (this.user.sphereShape.radius * 1.02 + axeBody.shapes[0].halfExtents.y)
            const z = this.userBody.position.z + shootDirection.z * (this.user.sphereShape.radius * 1.2 + axeBody.shapes[0].halfExtents.z)

            axeBody.position.set(x, y, z);
            axeMesh.position.copy(axeBody.position);
        });
    }

    getShootDirection() {
        const vector = new THREE.Vector3(0, 0, 1);
        vector.unproject(this.camera.instance);
        const ray = new THREE.Ray(this.userBody.position, vector.sub(this.userBody.position).normalize());
        return ray.direction;
    }

    initPointerLock() {
        this.controls = new PointerLockControlsCannon(this.camera.instance, this.userBody);
        this.scene.add(this.controls.getObject());

        instructions.addEventListener('click', () => {
            this.controls.lock();
        });

        this.controls.addEventListener('lock', () => {
            this.controls.enabled = true;
            instructions.style.display = 'none';
        });

        this.controls.addEventListener('unlock', () => {
            this.controls.enabled = false;
            instructions.style.display = null;
        });
    }

    update(delta) {
        if (this.controls) {
            this.controls.update(delta);

            if (this.controls.enabled) {
                this.physicsWorld.step(1 / 60, delta / 1000);
                this.jenga.update();

                for (let i = 0; i < this.axesBody.length; i++) {
                    this.axesMesh[i].position.copy(this.axesBody[i].position);
                    this.axesMesh[i].quaternion.copy(this.axesBody[i].quaternion);
                }
            }
        }
    }
}
