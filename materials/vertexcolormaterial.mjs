import Material from '../engine/material.mjs'
import util from '../engine/util.mjs'
import { mat4 } from '../lib/gl-matrix.mjs'


/*
 * Material which uses a color attribute of the vertices.
 */
class VertexColorMaterial extends Material {
	constructor(gl, config) {
		super(gl, config, 'vertexcolor')
	}

	// bind the material's specific shader parameters
	bind(mesh, transform, camera) {

		// the material knows which buffer it needs
		if (!mesh.coordsBuffer || !mesh.colorsBuffer) {
			util.warn('VertexColorMaterial needs vertices with coords and colors.')
			return
		}

		// create all necessary matrices
		let projectionMatrix = camera.getProjection()
        let viewMatrix       = camera.getView()
        let modelViewMatrix  = mat4.create()
        mat4.multiply(viewMatrix, transform, modelViewMatrix)

        // send matrices to the gpu
		this.program.setUniform('projectionMatrix', projectionMatrix)
		this.program.setUniform('modelViewMatrix', modelViewMatrix)
		// send vertex attributes to the gpu
		this.program.setAttribute('vertexPosition', mesh.coordsBuffer)
		this.program.setAttribute('vertexColor', mesh.colorsBuffer)
	}
}


export default VertexColorMaterial
