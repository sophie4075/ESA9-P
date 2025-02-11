import FullscreenPass from '../engine/fullscreenpass.mjs'

/*
 * Renderpass which inverts colors right to a vertical curtain.
 */
class InvertPass extends FullscreenPass {
	constructor(gl, config) {
		super(gl, config, 'invert')

		this.curtain = 0.5
	}

	// bind the pass's specific shader parameters
	bind(texture) {
		super.bind() // dont forget
		
		this.program.setUniform('curtain', this.curtain)
		this.program.setTexture('image', 0, texture)
	}
}


export default InvertPass
