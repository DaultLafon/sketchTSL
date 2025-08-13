import * as THREE from "three/webgpu";
import Experience from '../Experience.js'
import { mx_noise_float, color, cross, dot, float, distance, abs, atan, length, floor, fract, mod, smoothstep, positionGeometry, max, min, transformNormalToView, positionLocal, timerLocal, cos, positionWorld, clamp, mul, sin, add, sign, step, Fn, uniform, varying, vec2, vec3, Loop, pow, texture, uv, vec4, transmission, emissive, metalness, log } from 'three/tsl';
import gsap from "gsap";

export default class Ring2 {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.ressources
        this.time = this.experience.time

        this.wave = true
        this.setLight()
        this.setMesh()
        this.setDebug()
        this.anim()
    }

    setLight() {
        this.ambient = new THREE.AmbientLight('#1e00ff', 20);
        this.dir = new THREE.DirectionalLight('#ffffff', 20);
        this.dir2 = new THREE.DirectionalLight('#ffffff', 5);

        this.dir.position.set(3, 3, -3);
        this.dir2.position.set(-3, -3, 3);
        this.scene.add(this.ambient, this.dir, this.dir2);
    }

    setFloor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardNodeMaterial({
                color: 'grey',
                roughness: 1,
                metalness: 0,
                transmission: 0.5,
                side: THREE.DoubleSide,
            })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.05;
        this.scene.add(floor);
    }

    setDebug() {
        if (this.experience.debug.active) {
            this.debugObject = {
                metalness: 0,
                roughness: 1,
                materialColor: this.meshes[0].material.color.getHex(),
                AmbLightColor: this.ambient.color.getHex(),
                DirLightColor: this.dir.color.getHex(),
            }
            const ui = this.experience.debug.ui

            ui.add(this.dir, 'intensity').min(0).max(10).step(0.01).name('dirLightIntensity')
            ui.add(this.ambient, 'intensity').min(0).max(10).step(0.01).name('ambientLightIntensity')
            ui.addColor(this.debugObject, 'AmbLightColor').name('ambientLightColor').onChange(() => {
                this.ambient.color = new THREE.Color(this.debugObject.AmbLightColor);
            });
            ui.addColor(this.debugObject, 'DirLightColor').name('directionalLightColor').onChange(() => {
                this.dir.color = new THREE.Color(this.debugObject.DirLightColor);
            });
            ui.add(this.debugObject, 'metalness').min(0).max(1).step(0.01).name('metalness').onChange(() => {
                this.meshes.forEach(mesh => {
                    mesh.material.metalness = this.debugObject.metalness;
                });
            });
            ui.add(this.debugObject, 'roughness').min(0).max(1).step(0.01).name('roughness').onChange(() => {
                this.meshes.forEach(mesh => {
                    mesh.material.roughness = this.debugObject.roughness;
                });
            });
            ui.addColor(this.debugObject, 'materialColor').name('materialColor').onChange(() => {
                this.meshes.forEach(mesh => {
                    mesh.material.color = new THREE.Color(this.debugObject.materialColor);
                });
            });
        }
    }

    getGeometry(size) {
        const curve = new THREE.Curve();
        curve.getPoint = function (t) {
            const angle = t * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle) * (size), Math.sin(angle) * (size), 0);
        };

        const squareShape = new THREE.Shape();
        const s = 0.2;
        const r = 0.05;

        squareShape.moveTo(-s + r, -s);
        squareShape.lineTo(s - r, -s);
        squareShape.absarc(s - r, -s + r, r, -Math.PI / 2, 0);
        squareShape.lineTo(s, s - r);
        squareShape.absarc(s - r, s - r, r, 0, Math.PI / 2);
        squareShape.lineTo(-s + r, s);
        squareShape.absarc(-s + r, s - r, r, Math.PI / 2, Math.PI);
        squareShape.lineTo(-s, -s + r);
        squareShape.absarc(-s + r, -s + r, r, Math.PI, 1.5 * Math.PI);

        const geometry = new THREE.ExtrudeGeometry(squareShape, {
            steps: 500,
            extrudePath: curve,
            bevelEnabled: false,
        });
        return geometry;
    }

    getMaterial(index, time, count, speed) {
        const t = time.mul(-6);

        const mat = new THREE.MeshStandardNodeMaterial({
            color: '#443b68',
            roughness: 0.4,
            metalness: 1,
            side: THREE.DoubleSide,
        });

        const modifiedPosition = positionGeometry.add(vec3(0, 0, 0));
        mat.positionNode = modifiedPosition;
        // mat.roughnessNode = float(0.5).sub(speed.mul(0.001));
        mat.emissiveNode = color('#443b68').mul(speed.mul(0.001)).mul(10);


        return mat;
    }

    anim() {
        const duration = 1;
        const delayBetweenMeshes = 0.06;
        let randomX = Math.random() * Math.PI * 0.2;
        let randomY = Math.random() * Math.PI * 0.2;


        const animateStep = () => {
            // Pour chaque mesh, on anime avec le même random
            this.meshes.forEach((mesh, i) => {
                const delay = 1 + (i * delayBetweenMeshes);

                gsap.to(mesh.rotation, {
                    duration,
                    delay, // petit décalage visuel
                    x: randomX,
                    y: randomY,
                    ease: "elastic"
                });
            });

            // Après la fin de toutes les animations + délai final, on relance
            const totalCycleTime =
                1 + (this.meshes.length * delayBetweenMeshes) + duration + 1;
            setTimeout(() => {
                randomX = (Math.random() - 0.5) * Math.PI * 0.2; // même valeur pour le nouveau cycle
                randomY = (Math.random() - 0.5) * Math.PI * 0.2; // même valeur pour le nouveau cycle
                console.log(randomX, randomY);

                animateStep();
            }, totalCycleTime * 500);
        };

        animateStep(); // lancer le premier cycle
    }


    setMesh() {
        const count = 20;
        this.meshes = [];
        this.tNode = uniform(0);
        this.group = new THREE.Group();

        for (let i = 0; i < count; i++) {
            const geometry = this.getGeometry(i * 0.4);
            const index = uniform(float(i));
            const speed = uniform(float(0));
            const material = this.getMaterial(index, this.tNode, count, speed);
            const mesh = new THREE.Mesh(geometry, material);

            mesh.userData.meshSpeed = speed;
            mesh.userData.lastZ = undefined;  // initialisation

            const globalScale = 0.1;
            mesh.scale.set(globalScale, globalScale, globalScale * 2.5);
            this.meshes.push(mesh);
            // this.group.position.z = 1.5;
            this.group.add(mesh);
        }
        this.scene.add(this.group);
    }

    update() {
        const t = this.time.elapsed * 0.001;
        this.tNode.value = t;


    }
}
