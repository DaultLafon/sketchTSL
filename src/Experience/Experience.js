import * as THREE from 'three/webgpu'
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Ressources from './Utils/Ressources.js'
import Debug from './Utils/Debug.js'
import sources from './sources.js'


let instance = null


/**
 * ? Pour passer de webgl à webgpu, 
 * ? 1 importer l'instance de three du dossier webgpu
 * ? 2 remplacer le renderer par le webgpurenderer
 * ? 3 this.instance.renderAsync rendre asynchrone le rendu du renderer
 * ? 4 remplecer les materials gltf par des node materials webgpu
 */



export default class Experience {
    constructor(canvas) {
        //on sauvegarde l'experience dans l'instance pour l'envoyers aux autres classes globalement dans le projet as needed

        if (instance) {
            return instance
        }
        instance = this


        // cette ligne permet d'accéder au canvas depuis la console mais il faut en avoir une seul sur la page window.experience devient accessible globalemennt dans le projet (cf: Camera.js constructor)
        window.experience = this

        // Options
        this.canvas = canvas
        // page container


        //Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.ressources = new Ressources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()









        //sizes resize Event
        this.sizes.on('resize', () => {
            this.resize()
        })
        //Time tick Event
        this.time.on('tick', () => {

            this.update()

        })


    }

    resize() {

        this.camera.resize()
        this.renderer.resize()

    }
    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()

    }


    // normalement destroy est come update et appelle la fonction destroy de chaque class pour faire cela proprement

    destroy() {

        //todo : Cette fonction est à complexifier en fonction du projet. par exemple, il faut disposer des effets de post processing (effectComposer)
        this.sizes.off('resize')
        this.time.off('tick')
        this.router.off('routing')

        // traverse the whole scene
        this.scene.traverse((child) => {

            if (child.isMesh) {
                child.geometry.dispose()


                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }

                }



            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active) {
            this.debug.ui.destroy()

        }
    }




}