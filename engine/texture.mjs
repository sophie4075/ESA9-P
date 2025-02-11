import util from './util.mjs'

let _pixel = new Uint8Array([255, 0, 0, 255]); // opaque red


/*
 * A texture on GPU. Load process is automated to sane defaults.
 * Features image and data loading. Empty textures (for FBO)
 * can also be created.
 */
class Texture {
    constructor(gl, config={}) {
        config.onLoaded = util.isFunction(config.onLoaded) ? config.onLoaded : null
        this.name = config.name || 'anon texture'

        // create a new texture object
        this.glTexture = gl.createTexture()

        // load an image into the texture
        if (config.path) {

            if (config.data)
                util.warn(`Config of texture "${this.name}" has "path" and "data" set, "data" will be ignored.`)
            
            // set up a dummy pixel so the texture can be used immediately (waiting for an image path)
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, _pixel)

            // set up an image object and its success/error callbacks
            this.glTexture.image = new Image()
            this.glTexture.image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)  // webgl specialty
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.glTexture.image)
                this.configure(gl, config)
                //gl.bindTexture(gl.TEXTURE_2D, null)
                util.log(`Texture image for "${this.name}" loaded.`)
                if (config.onLoaded)
                    config.onLoaded()
            }
            this.glTexture.image.onerror = () => {
                util.crit(`Could not load texture image for "${this.name}" with path "${config.path}".`)
                if (config.onLoaded)
                    config.onLoaded()
            }
            // start loading process
            this.glTexture.image.src = config.path
        }
        // load data directly as image
        else if (config.data) {
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, config.width, config.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, config.data)
            this.configure(gl, config)
            util.log(`Texture data for "${this.name}" loaded.`)
            if (config.onLoaded)
                config.onLoaded()
        }
        // create an empty texture
        else {
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
            this.configure(gl, config)
            if (config.onLoaded)
                config.onLoaded()
        }
    }

    // Simple texture configuration basically deciding to set up mipmapping or not.
    // WebGL 1 has some restrictions if the texture dimensions are not powers of 2.
    configure(gl, config) {
       
        let filter = config.filter === 'nearest' ? gl.NEAREST : gl.LINEAR

        // a lot of options here, we keep it simple
        // https://registry.khronos.org/OpenGL-Refpages/es2.0/xhtml/glTexParameter.xml
        if (this.glTexture.image) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
            if (config.useMipMap &&
                util.isPowerOf2(this.glTexture.image.width) &&
                util.isPowerOf2(this.glTexture.image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D)
            }
        }
        else if (config.data) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
            if (config.useMipMap &&
                util.isPowerOf2(config.width) &&
                util.isPowerOf2(config.height)) {
                gl.generateMipmap(gl.TEXTURE_2D)
            }
        }
        else {
            // avoid mipmapping
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
    }
}


export default Texture
