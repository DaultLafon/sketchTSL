import * as THREE from "three/webgpu";
import Experience from "../Experience";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { mx_noise_float, normalize, transformNormalToView, attribute, cos, min, tangentLocal, length, sqrt, assign, normalWorld, normalView, clamp, screenUV, color, cross, mix, lessThanEqual, normalLocal, smoothstep, dot, float, positionLocal, sign, step, Fn, uniform, varying, vec2, vec3, Loop, pow, texture, uv, vec4, vertexStage, sin, xor } from 'three/tsl';


export default class samDelatour {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.ressources
        this.time = this.experience.time
        this.verticeFactor = 1
        // 



        // 
        this.setBase()


    }

    setBase() {


    }

    update() {
        this.time.value = this.experience.time.elapsed * 0.001

    }
}