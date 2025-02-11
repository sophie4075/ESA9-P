import Texture from './texture.mjs'

/*
 * The Texture loader takes care of loading images and creating textures in a convenient way.
 * Do not touch the code unless there are bugs or you know what you are doing.
 * The only place to edit should be the _textureInfos dictionary to add image paths.
 */

// all to be loaded textures info
let _textureInfos = {
    'default'  : { path: '' },
    'moon'     : { path: './textures/moon.jpg' },
    'webgllogo': { path: './textures/webgllogo.jpg' },
    'textureA' : { path: './textures/textureA.jpg' },
    'textureB' : { path: './textures/textureB.jpg'},
    'textureBlend': { path: './textures/blend.jpg' },
    'sun'     : { path: './textures/512px-Solarsystemscope_texture_2k_sun.jpg' },
    'earth'     : { path: './textures/earth.jpg' },
    'albedoTex' : {path: './textures/rustediron1-alt2-bl/rustediron2_basecolor.png' },
    'normalTex' : {path: './textures/rustediron1-alt2-bl/rustediron2_normal.png' },
    'metallicTex' : {path: './textures/rustediron1-alt2-bl/rustediron2_metallic.png' },
    'roughnessTex' : {path: './textures/rustediron1-alt2-bl/rustediron2_roughness.png' },
    'aoTex' : {path: './textures/Iron-Scuffed_bl/Iron-Scuffed_basecolor.png' },
    'diffiuseMap': {path: './textures/diamond_block.png'},
    'specularMap': {path: './textures/diamond_specular2.png'},


    // add more image paths here
}

const NUM_TEXTURES = Object.keys(_textureInfos).length
let _numLoaded = 0
let _onLoadedCallback = () => {}


let _onLoadedTexture = function() {
    if (++_numLoaded === NUM_TEXTURES)
        _onLoadedCallback()
}

let _loadTexture = function(gl, name) {
    _textureInfos[name].texture = new Texture(gl, {
        name     : name,
        path     : _textureInfos[name].path,
        onLoaded : _onLoadedTexture
    })
}


let TextureLoader = {

    load: function(gl, onLoaded) {
        _onLoadedCallback = onLoaded
        for (let name in _textureInfos) {
            _textureInfos[name].texture = null
            _loadTexture(gl, name)
        }
    },

    getTexture(name) {

        if (!_textureInfos[name]) {
            console.error(`Texture '${name}' is not defined in _textureInfos.`);
            return null;
        }

        return _textureInfos[name].texture
    }
}


export default TextureLoader
