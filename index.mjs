
import Shaders from './engine/shaderloader.mjs'
import Textures from './engine/textureloader.mjs'
import Renderer from './engine/renderer.mjs'
import Input from './app/input.mjs'
import Scene from './app/scene.mjs'
import util from './engine/util.mjs'

/*
 * Entry point of the application. There is not really any
 * need to change a lot here soon.
 */

// initializes a WebGL context and returns it when successful.
let initWebGL = function(canvasID) {
    let canvas = util.byid(canvasID)
    if (!canvas)
        util.fatal('Canvas not found...')

    // get WebGL rendering context for canvas element
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
    let glOptions = {
        alpha     : true,
        depth     : true,
        stencil   : false,
        antialias : false
    }

    let gl
    try {
        gl = canvas.getContext('webgl', glOptions) || 
             canvas.getContext('experimental-webgl', glOptions)
    }
    catch (ex) {
        util.fatal('Could not create WebGL rendering context.', ex)
    }

    if (!gl)
        util.fatal('Could not create WebGL rendering context.')

    // create a debugging wrapper of the context object
    // NOTE: this makes webgl really slow, if everything is fine, disable it for performance
    let useGLDebug = true
    if (useGLDebug)
    gl = WebGLDebugUtils.makeDebugContext(gl, function(error, funcname, args) {
        throw `${WebGLDebugUtils.glEnumToString(error)} was caused by call to: ${funcname}`   
    })

    return gl
}

let startApp = function(gl) {

    // stick the engine together
    let scene    = new Scene(gl)
    let renderer = new Renderer(gl)
    let input    = new Input(gl, { renderer: renderer })

    let fps = 0
    let last = 0
    let stats = util.byid('stats')

    // define the main loop
    let mainloop = function() {

        // integrate the scene
        if (!input.paused) {
            scene.update(0.01)
        }
        
        // render next frame
        renderer.render(scene)

        // get current inputs
        let now = performance.now()
        fps = now - last
        last = now
         
        stats.innerHTML = `fps: ${Math.round(1000 / fps)}` +
            ` pos: ${Math.trunc(input.mouse.pos[0])}, ${Math.trunc(input.mouse.pos[1])}` +
            ` dxy: ${input.mouse.dxy}`
    
        // discard outdated inputs
        input.update()

        // let the browser do the fps thing
        requestAnimationFrame(function() {     
            mainloop()
        })
    };

    // start it
    mainloop()
}

window.onload = function() {
    util.info('page loaded')

    let gl = initWebGL('canvas3d')

    let shadersLoaded  = false
    let texturesLoaded = false

    // load textures and shader programs
    Textures.load(gl, function() {
        util.info('textures loaded')
        texturesLoaded = true
    })
    Shaders.load(gl, function() {
        util.info('shaders loaded')
        shadersLoaded = true
    })

    // wait until everything is loaded
    let intervalID = setInterval(function() {
        if (texturesLoaded && shadersLoaded) {

            clearInterval(intervalID)
            util.warn('starting app...')
            startApp(gl)
        }
    }, 1)
}
