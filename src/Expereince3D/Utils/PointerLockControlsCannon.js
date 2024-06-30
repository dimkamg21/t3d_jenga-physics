import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class PointerLockControlsCannon extends THREE.EventDispatcher {
  constructor(camera, cannonBody) {
    super();

    this.enabled = false;
    this.cannonBody = cannonBody;
    this.velocityFactor = 0.08;
    this.jumpVelocity = 5;

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 20;
    this.yawObject.add(this.pitchObject);

    this.quaternion = new THREE.Quaternion();

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.canJump = false;

    const contactNormal = new CANNON.Vec3();
    const upAxis = new CANNON.Vec3(0, 1, 0);
    this.cannonBody.addEventListener('collide', (event) => {
      const { contact } = event;

      if (contact.bi.id === this.cannonBody.id) {
        contact.ni.negate(contactNormal);
      } else {
        contactNormal.copy(contact.ni);
      }

      if (contactNormal.dot(upAxis) > 0.5) {
        this.canJump = true;
      }
    });

    this.velocity = this.cannonBody.velocity;
    this.inputVelocity = new THREE.Vector3();
    this.euler = new THREE.Euler();

    this.lockEvent = { type: 'lock' };
    this.unlockEvent = { type: 'unlock' };

    this.connect();
  }

  connect() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerlockChange);
    document.addEventListener('pointerlockerror', this.onPointerlockError);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  disconnect() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerlockChange);
    document.removeEventListener('pointerlockerror', this.onPointerlockError);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  dispose() {
    this.disconnect();
  }

  lock() {
    document.body.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

  onPointerlockChange = () => {
    if (document.pointerLockElement) {
      this.dispatchEvent(this.lockEvent);
      this.isLocked = true;
    } else {
      this.dispatchEvent(this.unlockEvent);
      this.isLocked = false;
    }
  };

  onPointerlockError = () => {
    console.error('PointerLockControlsCannon: Unable to use Pointer Lock API');
  };

  onMouseMove = (event) => {
    if (!this.enabled) {
      return;
    }

    const { movementX, movementY } = event;

    this.yawObject.rotation.y -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;

    this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));
  };

  onKeyDown = (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;

      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;

      case 'Space':
        if (this.canJump) {
          this.velocity.y = this.jumpVelocity;
        }
        this.canJump = false;
        break;
    }
  };

  onKeyUp = (event) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;

      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
    }
  };

  getObject() {
    return this.yawObject;
  }

  getDirection() {
    const vector = new THREE.Vector3(0, 0, -1);
    vector.applyQuaternion(this.quaternion);
    return vector;
  }

  update(delta) {
    if (this.enabled === false) {
      return;
    }

    delta *= 0.1

    this.inputVelocity.set(0, 0, 0);

    if (this.moveForward) {
        this.inputVelocity.z = -this.velocityFactor * delta;

        if (this.velocity.z === 0) {
          const impulse = new CANNON.Vec3(0, 0, -1);
          const worldPoint = new CANNON.Vec3(0, 0, 0);
          this.cannonBody.applyImpulse(impulse, worldPoint);
        }
    }
    if (this.moveBackward) {
      this.inputVelocity.z = this.velocityFactor * delta;

      if (this.velocity.z === 0) {
        const impulse = new CANNON.Vec3(0, 0, 1);
        const worldPoint = new CANNON.Vec3(0, 0, 0);
        this.cannonBody.applyImpulse(impulse, worldPoint);
      }
    }
    if (this.moveLeft) {
      this.inputVelocity.x = -this.velocityFactor * delta;

      if (this.velocity.x === 0) {
        const impulse = new CANNON.Vec3(-1, 0, 0); 
        const worldPoint = new CANNON.Vec3(0, 0, 0);
        this.cannonBody.applyImpulse(impulse, worldPoint);
      }
    }
    if (this.moveRight) {
      this.inputVelocity.x = this.velocityFactor * delta;

      if (this.velocity.x === 0) {
        const impulse = new CANNON.Vec3(1, 0, 0);
        const worldPoint = new CANNON.Vec3(0, 0, 0);
        this.cannonBody.applyImpulse(impulse, worldPoint);
      }
    }

    this.euler.x = this.pitchObject.rotation.x;
    this.euler.y = this.yawObject.rotation.y;
    this.euler.order = 'XYZ';
    this.quaternion.setFromEuler(this.euler);
    this.inputVelocity.applyQuaternion(this.quaternion);

    const directionVelocity = new CANNON.Vec3(this.inputVelocity.x, 0, this.inputVelocity.z);

    this.velocity.vadd(directionVelocity, this.velocity);
    this.yawObject.position.copy(this.cannonBody.position);
  }
}

export { PointerLockControlsCannon };

export function cannonVector(vec) { return new CANNON.Vec3(vec.x, vec.y, vec.z); } 
