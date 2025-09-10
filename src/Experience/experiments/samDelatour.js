import * as THREE from "three/webgpu";
import Experience from "../Experience";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { mx_noise_float, normalize, transformNormalToView, tangentLocal, length, sqrt, assign, normalWorld, normalView, clamp, screenUV, color, cross, mix, lessThanEqual, normalLocal, smoothstep, dot, float, positionLocal, sign, step, Fn, uniform, varying, vec2, vec3, Loop, pow, texture, uv, vec4 } from 'three/tsl';


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
        let geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32 * this.verticeFactor, 32 * this.verticeFactor)
        geo = mergeVertices(geo)
        geo.computeTangents()



        const mat = new THREE.MeshStandardNodeMaterial()
        // vec3 GetNormal(vec3 p) {
        //     vec2 e = vec2(.001, 0);
        //     vec3 n = GetDist(p).x - 
        //         vec3(GetDist(p-e.xyy).x, GetDist(p-e.yxy).x,GetDist(p-e.yyx).x);

        //     return normalize(n);
        // }
        // ...existing code...

        // ...existing code...



        // ...existing code...
        // ...existing code...
        let computedNormals = varying(vec3(0, 0, 0), 'vec3')

        const getPos = Fn(([pos]) => {

            const y = float(1).sub(pos.y.add(0.5))

            const radius = sqrt(pow(0.5, 2).sub(pow(pos.y, 2)))
            const xNorm = pos.x.div(0.5)  // normalisé [-1,1]
            const zNorm = pos.z.div(0.5)

            const newX = radius.mul(xNorm).mul(2.2)
            const newZ = radius.mul(zNorm).mul(2.2)


            // step(0.5, y)
            const finalPos = vec3(
                mix(pos.x, newX, step(y, 0.25)),
                pos.y,
                mix(pos.z, newZ, step(y, 0.25))
            )
            return finalPos
        })

        // mat.wireframe = true
        mat.positionNode = Fn(() => {



            return getPos(positionLocal)
        })()

        const normalDeformed = Fn(() => {
            // normals
            const shift = float(0.01)
            const tan = tangentLocal
            const biTan = cross(normalLocal, tan)
            // neighboors
            let posA = positionLocal.add(tan.mul(shift))
            let posB = positionLocal.add(biTan.mul(shift))
            // 
            posA = getPos(posA)
            posB = getPos(posB)
            //
            const toA = normalize(getPos(posA).sub(getPos(positionLocal)))
            const toB = normalize(getPos(posB).sub(getPos(positionLocal)))

            const n = normalize(cross(toA, toB))
            // const n = (cross(toA, toB))

            return n
        })

        mat.normalNode = Fn(() => {
            return normalDeformed()
        })()



        mat.colorNode = Fn(() => {

            const pos = positionLocal

            // const lightDir = normalize(vec3(-1, 0.1, -1))
            // const light = clamp(dot(lightDir, normalLocal), 0, 1).add(0.5)


            return vec4(normalDeformed(), 1.)
            // return vec4(vec3(pos.y), 1.)
        })()
        mat.needsUpdate = true


        const mesh = new THREE.Mesh(geo, mat)
        this.scene.add(mesh)
        const dirLight = new THREE.DirectionalLight('#ffffff', 1)
        dirLight.position.set(3, 3, 3)
        this.scene.add(dirLight)

    }

    update() {

    }
}