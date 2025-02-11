import SceneNode from './scenenode.mjs'
import util from './util.mjs'
import { mat4 } from '../lib/gl-matrix.mjs'

/*
 * A camera object. Can project orthographic or with perspective.
 */ 
class Camera extends SceneNode {
	constructor(gl, config={}) {
		config.name = config.name || 'anon camera'
		super(gl, config)

		this.eye = this.getEye()
		this.pov = config.pov || [0,0,0]	// focus point of the camera (pov = point of view)
		this.up  = config.up  || [0,1,0]	// up orientation of the camera

		this.projectionType = config.projectionType || 'perspective'
		
		// perspective attributes
		this.perspectiveMatrix = mat4.identity()
		this.fovy  = config.fovy  || 60
		this.znear = config.znear || 0.01
		this.zfar  = config.zfar  || 100

		// orthographic attributes
		this.orthographicMatrix = mat4.identity()
		this.orthoScale = config.orthoScale || 1

		this.setProjectionType(this.projectionType)
	}

	// Returns the camera position in world coordinates.
	getEye() {
		return [this.worldTransform[12], this.worldTransform[13], this.worldTransform[14]]
	}

	// Update the projection type of the camera.
	setProjectionType(type) {
		let aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight
		switch (type) {
			case 'perspective':
				this.projectionType = 'perspective'
				this.perspectiveMatrix = mat4.perspective(this.fovy, aspectRatio, this.znear, this.zfar)
				break
			case 'orthographic':
				this.projectionType = 'orthographic'
				let os = this.orthoScale
				this.orthographicMatrix = mat4.ortho(-aspectRatio * os, aspectRatio * os, -os, os, this.znear, this.zfar)
				break
			default:
				util.warn(`Unknown projection type "${type}" for camera ${this.name}, ignoring.`)
				break
		}
	}

	// Returns the current camera projection matrix.
	getProjection() {
		return this.projectionType === 'perspective' ? this.perspectiveMatrix : 
			   this.projectionType === 'orthographic' ? this.orthographicMatrix :
			   mat4.identity() // should not happen
	}

	// Returns the current camera view matrix.
	getView() {
		return mat4.lookAt(
			this.eye,
			this.pov,
			this.up
		)
	}

	// Set up where the camera looks at.
	// Be careful to not align up and pov direction,
	// in this case you will see nothing!
	lookAt(pov, up=[0,1,0]) {
		this.eye = this.getEye()
		this.pov = pov
		this.up  = up
	}
}


export default Camera
