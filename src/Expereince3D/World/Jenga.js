import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Expereince3D from '../Expereince3D';
import PhysicsWorld from './PhysicsWorld';


export default class Jenga {
    constructor() {
        this.experience3D = new Expereince3D();
        this.scene = this.experience3D.scene;
        this.resources = this.experience3D.resources;
        this.physicWorld = new PhysicsWorld();
        this.world = this.physicWorld.instance;

        this.haystacksMesh = [];
        this.haystacksBody = [];
        
        this.jengaSize = 0.5;

        this.resource = this.experience3D.resources;

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.buildJenga();
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(this.jengaSize, this.jengaSize, this.jengaSize * 3, 100, 100, 100);
    }

    setTextures() {
        this.textures = {};

        this.textures.color = this.resources.items.haystackColorTexture;
        this.textures.color.colorSpace = THREE.SRGBColorSpace

        this.textures.normal = this.resources.items.haystackNormalTexture;

        this.textures.roughness = this.resources.items.haystackMetallicRoughness;
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
            metalnessMap: this.textures.roughness,
            roughnessMap:  this.textures.roughness,
        });
    }

    createPhysicBox(position, rotation) {
        const halfExtents = new CANNON.Vec3(this.jengaSize / 2, this.jengaSize / 2, (this.jengaSize * 3) / 2);
        const shape = new CANNON.Box(halfExtents);

        const body = new CANNON.Body({
            mass: 2,
            position: position,
            shape: shape,
        });

        body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
        body.sleepSpeedLimit = 0.2;

        return body;
    }

    buildJenga() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                const haystack = new THREE.Mesh(this.geometry, this.material);
                haystack.position.y = (this.jengaSize + i) * 0.52;

                if (i % 2 === 1) {
                    haystack.position.z = (-1 + j) * 0.52;
                    haystack.rotation.y = Math.PI / 2;
                } else {
                    haystack.position.x = (-1 + j)  * 0.52;
                }

                haystack.castShadow = true;
                haystack.receiveShadow = true;
                this.scene.add(haystack);

                const physicHaystack = this.createPhysicBox(
                    new CANNON.Vec3(haystack.position.x, haystack.position.y, haystack.position.z),
                    haystack.rotation
                );

                this.world.addBody(physicHaystack);

                haystack.userData.body = physicHaystack;

                this.haystacksMesh.push(haystack);
                this.haystacksBody.push(physicHaystack);
            }
        }
    }

    update() {
        for (let i = 0; i < this.haystacksMesh.length; i++) {
            this.haystacksMesh[i].position.copy(this.haystacksBody[i].position);
            this.haystacksMesh[i].quaternion.copy(this.haystacksBody[i].quaternion);
        }
    }
} 
