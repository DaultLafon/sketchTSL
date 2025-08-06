import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {

    constructor() {
        //super permet de récupérer le constructeur de la fonction parente (eventEmitter)
        super()
        //setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        //resize
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            // ici on emet un evenement de resize pour pouvoir l'ecouter sur les autres classes (camera, renderer) et les update à ce moment la 
            this.trigger('resize')

        })
    }



}