import * as THREE from 'three/webgpu'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



export default class Camera {


    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.animationDuration = 1000
        this.setInstance()
        this.setOrbitControls()

    }

    setInstance() {
        //une instance de la camera
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width /
            this.sizes.height,
            0.1,
            100
        )
        // this.instance = new THREE.OrthographicCamera(
        //     -this.experience.sizes.width / 2,
        //     this.experience.sizes.width / 2,
        //     this.experience.sizes.height / 2,
        //     -this.experience.sizes.height / 2,
        //     -1000,
        //     1000
        // )


        this.instance.position.set(0, 0, 3)

        this.scene.add(this.instance)


    }



    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }
    resize() {


        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
    update() {
        this.controls.update()

    }




}