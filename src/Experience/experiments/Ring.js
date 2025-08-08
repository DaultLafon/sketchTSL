import * as THREE from "three/webgpu";
import Experience from '../Experience.js'
import { mx_noise_float, color, cross, dot, float, distance, abs, mod, smoothstep, positionGeometry, max, min, transformNormalToView, positionLocal, timerLocal, cos, positionWorld, clamp, mul, sin, add, sign, step, Fn, uniform, varying, vec2, vec3, Loop, pow, texture, uv, vec4, transmission, emissive, metalness } from 'three/tsl';

export default class Ring {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.ressources
        this.time = this.experience.time

        this.wave = true
        this.setLight()
        this.setMesh()
        this.setDebug()

    }
    setLight() {
        this.ambient = new THREE.AmbientLight('#1e00ff', 2);
        this.dir = new THREE.DirectionalLight('#ffffff', 20);

        this.dir.position.set(3, 3, -3);
        this.scene.add(this.ambient, this.dir);
        // add helper
        // this.scene.add(new THREE.CameraHelper(this.dir.shadow.camera))

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
        // Un chemin circulaire
        const curve = new THREE.Curve();
        curve.getPoint = function (t) {
            const angle = t * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle) * size, Math.sin(angle) * size, 0);
        };

        // Une section carrée
        const squareShape = new THREE.Shape();
        const s = 0.2; // demi-largeur
        const r = 0.05; // rayon des coins arrondis

        // Départ coin inférieur gauche (en haut à gauche)
        squareShape.moveTo(-s + r, -s);

        // bas → droite
        squareShape.lineTo(s - r, -s);
        squareShape.absarc(s - r, -s + r, r, -Math.PI / 2, 0);

        // droite → haut
        squareShape.lineTo(s, s - r);
        squareShape.absarc(s - r, s - r, r, 0, Math.PI / 2);

        // haut → gauche
        squareShape.lineTo(-s + r, s);
        squareShape.absarc(-s + r, s - r, r, Math.PI / 2, Math.PI);

        // gauche → bas
        squareShape.lineTo(-s, -s + r);
        squareShape.absarc(-s + r, -s + r, r, Math.PI, 1.5 * Math.PI);


        // Extrusion le long du chemin
        const geometry = new THREE.ExtrudeGeometry(squareShape, {
            steps: 500,
            extrudePath: curve,
            bevelEnabled: false,

        });
        return geometry;
    }
    getMaterial(index, time) {

        const t = time.mul(-6);
        const pi = float(Math.PI); // ok ici

        const mat = new THREE.MeshStandardNodeMaterial({
            // color: '#743925',
            color: '#443b68',
            // color: '#683b3b',
            roughness: 0.4,
            // metalness: 0.8,
            metalness: 1,
            side: THREE.DoubleSide,
        });

        const i = index;

        const x = t.add(i.mul(0.3));
        const freq = float(0.2); // ✔️ Corrigé
        const amp = smoothstep(0., 1., mod(x.mul(-1), pi.mul(3).mul(pi)).div(pi.mul(3).mul(pi)));

        const xMod = mod(x, float(Math.PI * 3 * Math.PI));
        const period = float(Math.PI * 3 * Math.PI);
        const seg = period.div(3.0); // découpe en 3 zones

        const a = smoothstep(float(0.0), seg, xMod);                   // 0 → 1
        const b = smoothstep(seg, seg.mul(2.0), xMod);                 // 1 → 2
        const c = smoothstep(seg.mul(2.0), period, xMod);              // 2 → 0

        const value = a.add(b).add(c.mul(-2)).mul(0.3);

        const z = sin(x).mul(float(0.8)).mul(value);

        const modifiedPosition = positionGeometry.add(vec3(0, 0, z));
        mat.positionNode = modifiedPosition;
        // mat.metalnessNode = min(distance(modifiedPosition, vec3(0, 0, 0)), float(1)).mul(0.6);
        mat.roughnessNode = max(z.sub(0.2).mul(-1), 0.2)
        mat.colorNode = color(mat.color.getHex()).mul(max(z.mul(-10), 0).add(0.8)).mul(vec3(1, 1, 1))


        // Optionnel : effets visuels
        // mat.emissiveNode = emissiveColor.mul(z.sub(2).mul(-1));
        // mat.metalnessNode = float(1).mul(z.mul(-1));

        return mat;
    }



    setMesh() {
        const count = 30;
        this.meshes = [];
        this.tNode = uniform(0); // tNode global, mis à jour chaque frame
        this.group = new THREE.Group();

        for (let i = 0; i < count; i++) {
            const geometry = this.getGeometry(i * 0.4);
            const index = uniform(float(i));
            const material = this.getMaterial(index, this.tNode); // crée un mat lié à tNode
            const mesh = new THREE.Mesh(geometry, material);

            mesh.rotation.x = Math.PI / 2;
            mesh.rotation.z = -Math.PI / 2;

            const globalScale = 0.1;
            mesh.scale.set(globalScale, globalScale, globalScale * 2.5);
            this.meshes.push(mesh);
            this.group.add(mesh);
        }
        this.scene.add(this.group);
    }


    update() {

        const t = this.time.elapsed * 0.001
        this.tNode.value = t;
        this.group.rotation.set(
            Math.cos(3) * 0.3,
            0,
            Math.sin(3) * 0.3
        )
        this.experience.camera.instance.position.set(
            Math.cos(3) * 1.5,
            1,
            Math.sin(3) * 1.5
        )
        this.experience.camera.instance.lookAt(new THREE.Vector3(this.group.position.x, this.group.position.y + 0.2, this.group.position.z));
    }
}