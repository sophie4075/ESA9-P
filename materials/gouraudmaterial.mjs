import Material from '../engine/material.mjs'
import util from '../engine/util.mjs'
import {mat3, mat4, vec3, vec4} from '../lib/gl-matrix.mjs'


/*
 * Material which calculates gouraud shading.
 */
class GouraudMaterial extends Material {
	constructor(gl, config) {
		super(gl, config, 'gouraud')
		
		this.config.ambient   = this.config.ambient   || [0,0,0]
		this.config.diffuse   = this.config.diffuse   || [1,1,1]
		this.config.specular  = this.config.specular  || [1,1,1]
		this.config.shininess = this.config.shininess || 32
	}

	//bind the material's specific shader parameters
	bind(mesh, transform, camera, light) {

		//console.log("I am light", light);

		// the material knows which buffer it needs
		if (!mesh.coordsBuffer || !mesh.normalsBuffer) {
			util.warn('GouraudMaterial needs vertices with coords and normals.')
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
		this.program.setAttribute('vertexNormal', mesh.normalsBuffer)

		// AUFGABE E3
		// TODO: compute normal matrix
		let normalMatrix = mat3.create()
		mat4.toMat3(modelViewMatrix, normalMatrix);
		mat3.inverse(normalMatrix, normalMatrix);
		mat3.transpose(normalMatrix, normalMatrix);



		// TODO: compute light position in view space
        let lightPositionEC = [0, 0, 0]
		let lightPosition = vec4.createFrom(light.worldTransform[12], light.worldTransform[13], light.worldTransform[14], 1.0);


		mat4.multiplyVec4(viewMatrix, lightPosition, lightPositionEC);
		//console.log('lightPositionEC: ', lightPositionEC);
		//console.log('lightPos', lightPosition)


		// send normal matrix to the gpu
        this.program.setUniform('normalMatrix', normalMatrix)
        // send light properties to the gpu
        this.program.setUniform('light.position', lightPositionEC)
        this.program.setUniform('light.color', light.color)
         // send matrial properties to the gpu
		this.program.setUniform('material.ambient',   this.config.ambient)
		this.program.setUniform('material.diffuse',   this.config.diffuse)
		this.program.setUniform('material.specular',  this.config.specular)
		this.program.setUniform('material.shininess', this.config.shininess)
	}


}


export default GouraudMaterial
