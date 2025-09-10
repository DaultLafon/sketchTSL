import * as THREE from "three/webgpu";
import Experience from "../Experience";
import Ring2 from "../experiments/Ring2.js";
import Ring from "../experiments/Ring.js";
import Ring3 from "../experiments/Ring3.js";
import samDelatour from "../experiments/samDelatour.js";

import { mx_noise_float, screenUV, color, cross, mix, lessThanEqual, dot, float, transformNormalToView, positionLocal, sign, step, Fn, uniform, varying, vec2, vec3, Loop, pow, texture, uv, vec4 } from 'three/tsl';


export default class World {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.ressources
        this.time = this.experience.time

        // A generer apres la gestion du loading manager
        // this.setPlane()

        // this.ring = new Ring()
        this.ring = new Ring3()
        // this.delatour = new samDelatour()









        this.update()

    }
    getMaterial() {
        const mat = new THREE.NodeMaterial()

        const finalColorNode = Fn(() => {
            let col = vec3(uv(), 0.5)
            col = pow(col, 1.8)
            return vec4(col, 1.)
        })

        mat.colorNode = finalColorNode()
        return mat
    }


    setPlane() {
        //
        this.mat = this.getMaterial()
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            this.mat
        )
        this.plane.rotation.y = -Math.PI

        // this.plane.scale.set(this.experience.sizes.width, this.experience.sizes.height)
        this.scene.add(this.plane)
    }



    update() {
        if (this.ring) {
            this.ring.update()
        }
        if (this.ring2) {
            this.ring.update()
        }
        if (this.ring3) {
            this.ring.update()
        }
        if (this.delatour) {
            this.delatour.update()
        }


    }

}