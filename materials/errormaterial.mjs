
import Material from '../engine/material.mjs'
import util from '../engine/util.mjs'
import { mat4 } from '../lib/gl-matrix.mjs'


/*
 * Error material. Used in case some other material is missing or fails.
 * One will notice because this material just renders an unlit pink color.
 */
class ErrorMaterial extends Material {
	constructor(gl, config) {
		super(gl, config, 'error')
	}

	// bind the material's specific shader parameters
	bind(mesh, transform, camera) {

		// the material knows which buffer it needs
		if (!mesh.coordsBuffer) {
			util.warn('ErrorMaterial needs vertices with coords.')
			return
		}

		// create all necessary matrices
		let projectionMatrix = camera.getProjection()
        let viewMatrix = camera.getView()
        let matrix = mat4.create()
        mat4.multiply(viewMatrix, transform, matrix)
        mat4.multiply(projectionMatrix, matrix, matrix)

        // send matrices to the gpu
        this.program.setUniform('modelViewprojectionMatrix', matrix)
        // send vertex attributes to the gpu
		this.program.setAttribute('vertexPosition', mesh.coordsBuffer)
	}
}


export default ErrorMaterial

