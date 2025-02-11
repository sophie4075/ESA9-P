import Texture from './texture.mjs'
import util from './util.mjs'

/**
 * Simple frame buffer object with one color attachment and an optional depth attachment.
 * Used for render-to-texture-techniques (e.g. multi pass). If an FBO is active,
 * all rendering will be redirected into its attachments instead of the default back buffer
 * (a.k.a. the screen) provided by WebGL.
 */
class FrameBufferObject {

	constructor(gl, config) {
		this.gl = gl
		this.config = config

		// create the first color attachment
		this.colorAttachment0 = new Texture(gl, { path: '' })
		gl.bindTexture(gl.TEXTURE_2D, this.colorAttachment0.glTexture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.config.width, this.config.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

		this.buffer = gl.createFramebuffer()
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
  		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorAttachment0.glTexture, 0)

  		// create an optional depth attachment
  		if (config.createDepthBuffer) {
			// create a depth renderbuffer
			let depthBuffer = gl.createRenderbuffer()
			gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer)
			// make a depth attachment with the same size as the color attachment
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.config.width, this.config.height)
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer)
		}

		let state = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
		if (state !== gl.FRAMEBUFFER_COMPLETE)
			util.fatal(`Framebuffer state is not complete: ${state}`)
	}
}


export default FrameBufferObject
