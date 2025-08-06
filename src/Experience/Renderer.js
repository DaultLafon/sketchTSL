import * as THREE from 'three/webgpu'
import Experience from './Experience.js'

export default class Renderer {


    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera
        this.setInstance()
        this.resize()




    }

    setInstance() {
        //une instance du renderer

        this.instance = new THREE.WebGPURenderer({
            canvas: this.canvas,
            antialias: true,
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap

        this.instance.setClearColor('#1f1e1a')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    }


    update() {
        this.instance.renderAsync(this.scene, this.camera.instance)


    }




}