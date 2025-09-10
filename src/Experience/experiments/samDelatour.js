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
        this.setBase()


    }

    setBase() {
        let geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 32)
        geo.computeTangents()



        const mat = new THREE.NodeMaterial()
        const vNormal = varying(vec3(0.));
        this.time = uniform(0, 'float');
        // 
        const displacement = Fn(([pos]) => {
            const x = pos.y
            const z = pos.y
            const res = vec3(
                x,
                pos.y,
                z
            )
            return res;
        });
        // var and uniforms


        // mat.wireframe = true
        // 
        mat.positionNode = Fn(() => {
            const disp = displacement(positionLocal)
            let newPos = vec3(positionLocal.x, positionLocal.y, positionLocal.z)

            const tan = attribute('tangent', 'vec4')
            const bitan = cross(normalLocal, vec3(tan.xyz))
            // 
            const shift = float(0.01)
            let na = newPos.add(tan.xyz.mul(shift))
            let nb = newPos.add(bitan.mul(shift))
            // 
            newPos = newPos.mul(displacement(newPos))
            na = na.mul(displacement(na))
            nb = nb.mul(displacement(nb))
            // 
            const toA = normalize(na.sub(newPos))
            const toB = normalize(nb.sub(newPos))
            const n = cross(toA, toB)
            vNormal.assign(n)
            return vec4(newPos, 1.)
        })()







        mat.colorNode = Fn(() => {



            return vec4(pow(vNormal, 2.), 1.)
        })()


        const mesh = new THREE.Mesh(geo, mat)
        this.scene.add(mesh)
        const dirLight = new THREE.DirectionalLight('#ffffff', 1)
        dirLight.position.set(3, 3, 3)
        this.scene.add(dirLight)

    }

    update() {
        this.time.value = this.experience.time.elapsed * 0.001

    }
}