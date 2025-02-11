import SceneNode from './scenenode.mjs'

/*
 * Base light class. Set up as a scene node like camera and models.
 */
class Light extends SceneNode {
	constructor(gl, config) {
		config.name = config.name || 'anon light'
		super(gl, config)

		this.color = config.color

		// extend with more properties, e.g. attenuation
	}
}


export default Light
