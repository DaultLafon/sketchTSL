import EventEmitter from './EventEmitter.js'


export default class Time extends EventEmitter {

    constructor() {
        //super permet de récupérer le constructeur de la fonction parente (eventEmitter)
        super()

        //Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
    tick() {
        const currentTime = Date.now()
        this.delta = (currentTime - this.current) * 0.001
        this.current = currentTime
        this.elapsed = this.current - this.start
        this.trigger('tick')

        requestAnimationFrame(() => {
            this.tick()
        })
    }



}