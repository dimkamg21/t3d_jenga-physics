import * as CANNON from 'cannon-es';

let instanceS = null;

export default class PhysicsWorld {
    constructor() {
        if (instanceS) {
            return instanceS;
        }

        instanceS = this;
       
        // this.instance.defaultContactMaterial.contactEquationStiffness = 1e9;
        // this.instance.defaultContactMaterial.contactEquationRelaxation = 4

        // const solver = new CANNON.GSSolver()
        // solver.iterations = 7
        // solver.tolerance = 0.1
        // this.instance.solver = new CANNON.SplitSolver(solver)

        this.setInstance();
        this.setMaterial();
    }

    setInstance() {
        this.instance = new CANNON.World();
        this.instance.gravity.set(0, -9.82, 0);
        this.instance.broadphase = new CANNON.NaiveBroadphase();
        this.instance.allowSleep = true;    
    }

    setMaterial() {
        this.defaultMaterial = new CANNON.Material('default');
        this.defaultContactMaterial = new CANNON.ContactMaterial(
            this.defaultMaterial,
            this.defaultMaterial,
            {
                friction: 1,
                restitution:0.3,
            }
        )

        this.instance.addContactMaterial(this.defaultContactMaterial);
    }
}
