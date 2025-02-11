import SceneNode from './scenenode.mjs'
import Mesh 	 from './mesh.mjs'
import Material  from './material.mjs'
import util      from './util.mjs'

/*
 * A model is an instance of a mesh with some material in the scene.
 * It is placed uniquely through a transform matrix.
 */
class Model extends SceneNode {
	constructor(gl, config) {
		super(gl, config)
		
		this.mesh     = config.mesh
		this.material = config.material

		if (!(this.mesh instanceof Mesh))
			util.fatal('Models must contain a mesh.')

		if (!(this.material instanceof Material))
			util.fatal('Models must have a material assigned.')
	}
}


export default Model
