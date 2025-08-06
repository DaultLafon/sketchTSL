
import * as THREE from "three/webgpu";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from "./EventEmitter";
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

export default class Ressources extends EventEmitter {
    constructor(sources) {
        super()

        this.progressRatio = 0

        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            (onLoad) => {

            },
            // Progress
            (itemURL, itemsLoaded, itemsTotal) => {
                const progressRatio = itemsLoaded / itemsTotal
                this.progressRatio = progressRatio

            },
            // Error
            (onError) => {

            }
        )


        //options
        this.sources = sources

        //setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        this.loaders.audioLoader = new THREE.AudioLoader(this.loadingManager);
        this.loaders.fontLoader = new FontLoader(this.loadingManager);
        this.loaders.rgbeLoader = new RGBELoader(this.loadingManager);
    }

    startLoading() {
        //load all sources
        this.sources.forEach((source) => {

            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);

                    },
                )

            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);

                    },
                )

            }
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);

                    },
                )

            }
            else if (source.type === 'audio') {
                this.loaders.audioLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);

                    },
                )
            }
            else if (source.type === 'font') {
                this.loaders.fontLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);

                    },
                )
            }
            else if (source.type === 'rgbe') {
                this.loaders.rgbeLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);

                    },
                )
            }

        })
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++
        if (this.loaded === this.toLoad) {

            this.trigger('ready')

        }
    }







}