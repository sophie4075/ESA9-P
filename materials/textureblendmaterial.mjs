import Material from '../engine/material.mjs'
import Textures from '../engine/textureloader.mjs'
import util from '../engine/util.mjs'
import { mat4 } from '../lib/gl-matrix.mjs'


class TextureBlendMaterial extends Material {
	constructor(gl, config) {
		super(gl, config, 'textureblend')

		this.config.textureA = this.config.textureA || Textures.getTexture('default');
		this.config.textureB = this.config.textureB || Textures.getTexture('default');
		this.config.textureBlend = this.config.textureBlend || Textures.getTexture('default');
	}

	/// bind the material's specific shader parameters
	bind(mesh, transform, camera) {

		//console.debug("TextureBlendMaterial bind called.");

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
		this.program.setTexture('textureA', 0, this.config.textureA)
		this.program.setTexture('textureB', 1, this.config.textureB)
		this.program.setTexture('textureBlend', 2, this.config.textureBlend)


	}
}


export default TextureBlendMaterial


