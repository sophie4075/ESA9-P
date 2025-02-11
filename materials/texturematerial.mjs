import Material from '../engine/material.mjs'
import Textures from '../engine/textureloader.mjs'
import util from '../engine/util.mjs'
import { mat4 } from '../lib/gl-matrix.mjs'


/*
 * Material which uses one uv-attribute of the vertices.
 */
class TextureMaterial extends Material {
	constructor(gl, config) {
		super(gl, config, 'texture')

		this.config.texture = this.config.texture || Textures.getTexture('default')
	}

	/// bind the material's specific shader parameters
	bind(mesh, transform, camera) {

		// the material knows which buffer it needs
		if (!mesh.coordsBuffer || !mesh.texcoordsBuffer) {
			util.warn('TextureMaterial needs vertices with texture coordinates.')
			return
		}

		// create all necessary matrices
        let tmp = mat4.create()
        mat4.multiply(camera.getView(), transform, tmp)
        mat4.multiply(camera.getProjection(), tmp, tmp)

        // send matrices to the gpu
        this.program.setUniform('mvpMatrix', tmp)
        // send vertex attributes to the gpu
		this.program.setAttribute('vertexPosition', mesh.coordsBuffer)
		this.program.setAttribute('vertexTexcoords', mesh.texcoordsBuffer)
		// send current texture setting to the gpu
		this.program.setTexture('texture', 0, this.config.texture)
	}
}


export default TextureMaterial
