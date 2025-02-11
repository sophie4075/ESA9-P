import Shaders from './shaderloader.mjs'
import Program from './program.mjs'
import util    from './util.mjs'

/*
 * Base class for materials. Should not be used directly as
 * the derivates will define the bind method. Specifically, they will
 * define the needed parameters to be sent to the shaders.
 */
class Material {
	constructor(gl, config, programName) {
		this.gl = gl
		this.config = config || {}
		this.program = Shaders.getProgram(programName)

		console.log("Shader-Programme:", this.program);


		if (!(this.program instanceof Program))
			util.fatal('Materials must contain a program.')
	}

	// This uploads the material's shaders to the GPU.
	use() {
		this.program.use()
	}

	// Remove the material's shaders from the pipeline (rarely needed).
	unuse() {
		this.program.unuse()
	}

	// Upload the variables to the shaders.
	bind() {
		util.fatal('Do not bind the base class directly.')
	}

	// Some materials may alter the pipeline state,
	// thus we need some cleanup function.
	unbind() {
		// stub defined if there is nothing to do
	}

}

export default Material
