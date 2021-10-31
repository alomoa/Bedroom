import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js'


const canvas = document.querySelector('canvas');

const gui = new dat.GUI()

const debugObject= {}



/**
 * Loader
 */

const gltfLoader = new GLTFLoader()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
const bedroomTexture = textureLoader.load('Baked.jpg')
bedroomTexture.flipY = false;
bedroomTexture.encoding = THREE.sRGBEncoding;

const bigMonitorTexture = textureLoader.load('portal_scene.png')
const smallMonitorTexture = textureLoader.load('bluescreenofdeath.png')

/** 
* Material
*/


const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bedroomTexture,
    side: THREE.DoubleSide

})
const smallMonitorMaterial = new THREE.MeshBasicMaterial({map:smallMonitorTexture})
const bigMonitorMaterial = new THREE.MeshBasicMaterial({map:bigMonitorTexture})
/**
 * GLTF
 */
gltfLoader.load('bedroom.glb',
    (gltf)=>{
        gltf.scene.traverse((child)=>{
            child.material = bakedMaterial
        })
        const bigMonitor = gltf.scene.children.find((child) => child.name ==="bigMonitorEmission")
        const smallMonitor = gltf.scene.children.find((child) => child.name ==="smallMonitorEmission")

        bigMonitor.material = bigMonitorMaterial;
        smallMonitor.material = smallMonitorMaterial;
        
        scene.add(gltf.scene)
    })



/**
 * Scene
 */

const scene = new THREE.Scene();

/**
 * Size
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(60, sizes.width/sizes.height)
camera.position.z = 3
camera.position.y = 5
camera.position.x = -5
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.outputEncoding = THREE.sRGBEncoding;

debugObject.clearColor = '#a29494'
renderer.setClearColor(debugObject.clearColor)

gui.addColor(debugObject, 'clearColor').onChange(()=>{
    renderer.setClearColor(debugObject.clearColor)
})

const tick = () => {

    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick();