import Program from './program.mjs'
import util from './util.mjs'

/*
 * The Shader loader takes care of loading and creating GLSL programs in a convenient way.
 * Do not touch the code unless there are bugs or you know what you are doing.
 * The only place to edit should be the _shaderPairs dictionary to add shaders.
 */

// define all to be loaded glsl files
let _shaderPairs = {
    error: {files: ['error.vert', 'error.frag']},
    vertexcolor: {files: ['vertexcolor.vert', 'vertexcolor.frag']},
    texture: {files: ['texture.vert', 'texture.frag']},
    gouraud: {files: ['gouraud.vert', 'gouraud.frag']},
    invert: {files: ['fullscreen.vert', 'invert.frag']},
    textureblend: {files: ['textureblend.vert', 'textureblend.frag']},
    gouraudtexture: {files: ['gouraudtexture.vert', 'gouraudtexture.frag']},
    light_cube: { files: ['light_cube.vert', 'light_cube.frag'] },
    phong: {files: ['phong.vert', 'phong.frag']},
    lightmap: {files: ['lightmap.vert', 'lightmap.frag']},
    pointlight: {files: ['pointlight.vert', 'pointlight.frag']}

    // add more shader pairs here
}

const NUM_SHADERPAIRS = Object.keys(_shaderPairs).length
let _numLoaded = 0
let _onLoadedCallback = () => {
}

let _gl
let _programs = {}
let _createPrograms = function () {
    // create all required GPU programs from vertex and fragment shaders
    for (let name in _shaderPairs) {
        _programs[name] = new Program(_gl, {
            name: name,
            codes: _shaderPairs[name].codes
        })

        console.log("Geladene Shader:", _shaderPairs);

    }
}


// automatically prepended precision header for all shaders
let _precisionHeader = `
    #if GL_FRAGMENT_PRECISION_HIGH == 1
        // highp is supported
        precision highp int;
        precision highp float;
    #else
        // highp is not supported
        precision mediump int;
        precision mediump float;
    #endif
`

let _loadShader = function (path, response) {
    if (typeof response !== 'function')
        util.fatal('need response callback')

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                response(xhr.responseText)
            }
            if (++_numLoaded === NUM_SHADERPAIRS * 2) {
                _createPrograms()
                _onLoadedCallback()
            }
        }
    }

    xhr.open('GET', path, true)
    xhr.send()
}

let ShaderLoader = {

    load: function (gl, onLoaded) {
        _gl = gl
        _onLoadedCallback = onLoaded

        const VERT = 0
        const FRAG = 1
        for (let pair in _shaderPairs) {
            pair = _shaderPairs[pair]
            pair.codes = ['', '']
            _loadShader('shaders/' + pair.files[VERT], (code) => {
                pair.codes[VERT] = _precisionHeader + code
            })
            _loadShader('shaders/' + pair.files[FRAG], (code) => {
                pair.codes[FRAG] = _precisionHeader + code
            })
        }
    },

    getCodes: function (name) {
        return _shaderPairs[name].codes
    },

    getProgram: function (name) {
        return _programs[name]
    }
}


export default ShaderLoader
