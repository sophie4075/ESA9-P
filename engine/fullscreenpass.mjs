import Material from './material.mjs'
import Plane from '../meshes/plane.mjs'
import util from './util.mjs'


/*
 * FullscreenPass renders a fullscreen quad to perform
 * pixel processing on images.
 */
class FullscreenPass extends Material {

	static quad = null

	// Makes sure that fullscreen pass shaders use vertexPosition and windowSize
	// as this is needed to perform the pass on every screen pixel.
	constructor(gl, config, programName) {
		super(gl, config, programName)
		if (!FullscreenPass.quad)
			FullscreenPass.quad = new Plane(gl)

		let avp = this.program.getAttribLocation('vertexPosition')
		if (avp == -1)
			util.fatal(`Fullscreenpass shader "${programName}" must have an attribute "vec3 vertexPosition"`)

		let uws = this.program.getUniformLocation('windowSize')
		if (avp == -1)
			util.fatal(`Fullscreenpass shader "${programName}" must have an uniform "vec2 windowSize"`)
	}

	// Bind the general fullscreen pass's specific shader parameters.
	bind() {
		this.program.setAttribute('vertexPosition', FullscreenPass.quad.mesh.coordsBuffer)
		this.program.setUniform('windowSize', [this.gl.canvas.width, this.gl.canvas.height])
	}

	// Draws a fullscreen quad. This way the pass shaders are performed
	draw() {
		FullscreenPass.quad.mesh.draw()  
	}
}


export default FullscreenPass
