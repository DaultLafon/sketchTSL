import * as THREE from "three/webgpu";
import Experience from '../Experience.js'
import { mx_noise_float, color, cross, dot, float, transformNormalToView, positionLocal, sign, step, Fn, uniform, varying, vec2, vec3, Loop, pow, texture, uv, vec4 } from 'three/tsl';

export default class Ring {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.ressources
        this.time = this.experience.time

        this.wave = true
        this.setMesh()

    }

    setMesh() {

    }

    update() {


    }
}