import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Expereince3D from '../Expereince3D';
import PhysicsWorld from './PhysicsWorld';

export default class Floor {
    constructor() {
        this.experience3D = new Expereince3D();
        this.scene = this.experience3D.scene;
        this.physicWorld = new PhysicsWorld();
        this.world =  this.physicWorld.instance;
        this.resources = this.experience3D.resources;
        this.defaultMaterial = this.world.defaultMaterial;

        // Setup
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
        this.setPhysic();
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(30, 30, 100, 100);
    }

    setTextures() {
        this.textures = {};

        this.textures.color = this.resources.items.floorColorTexture;
        this.textures.color.repeat.set(8, 8);
        this.textures.color.wrapS = THREE.RepeatWrapping;
        this.textures.color.wrapT = THREE.RepeatWrapping;
        this.textures.color.colorSpace = THREE.SRGBColorSpace

        this.textures.armTexture = this.resources.items.floorARMTexture;
        this.textures.armTexture.repeat.set(8, 8);
        this.textures.armTexture.wrapS = THREE.RepeatWrapping;
        this.textures.armTexture.wrapT = THREE.RepeatWrapping;

        this.textures.normal = this.resources.items.floorNormalTexture;
        this.textures.normal.repeat.set(8, 8);
        this.textures.normal.wrapS = THREE.RepeatWrapping;
        this.textures.normal.wrapT = THREE.RepeatWrapping;


        this.textures.dissTexture = this.resources.items.floorDisplacementTexture;
        this.textures.dissTexture.repeat.set(8, 8);
        this.textures.dissTexture.wrapS = THREE.RepeatWrapping;
        this.textures.dissTexture.wrapT = THREE.RepeatWrapping;

        this.textures.alpha = this.resources.items.floorAlphaTexture;
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            alphaMap: this.textures.alpha,
            transparent: true,
            map: this.textures.color,
            displacementMap: this.textures.dissTexture,
            displacementScale: 0.3,
            displacementBias: - 0.2,
            aoMap: this.textures.armTexture,
            roughnessMap: this.textures.armTexture,
            metalnessMap: this.textures.armTexture,
            normalMap:  this.textures.normal
        })
    }

    setPhysic() {
        this.floorShape = new CANNON.Plane();
        this.floorBody = new CANNON.Body();
        this.floorBody.mass = 0;
        this.floorBody.addShape(this.floorShape);
        this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);

        this.world.addBody(this.floorBody);
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh)
    }
}
