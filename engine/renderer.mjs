import Shaders from './shaderloader.mjs'
import Model from './model.mjs'
import Plane from '../meshes/plane.mjs'
import ErrorMaterial from '../materials/errormaterial.mjs'

import InvertPass from '../passes/invertpass.mjs'

import FrameBufferObject from './framebufferobject.mjs'
import util from './util.mjs'
import { mat3, mat4 } from '../lib/gl-matrix.mjs'


/*
 * A simple renderer which is capable of multi pass rendering.
 */
class Renderer {
	constructor(gl, config) {
		this.gl = gl

		// query some stuff, disable if you don't like the console spam
		let glAttributes = gl.getContextAttributes()
		let antialias = glAttributes.antialias
		let samples   = gl.getParameter(gl.SAMPLES)
		util.log(antialias ?
			`antialiasing is supported with ${samples}x${samples} MSAA` :
			`antialiasing is not supported`
		)

		let maxVertexTextureUnits   = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
		let maxFragmentTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
		let maxCombinedTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
		util.log(`max vertex shader textures: ${maxVertexTextureUnits}`)
		util.log(`max fragment shader textures: ${maxFragmentTextureUnits}`)
		util.log(`max combined shader textures: ${maxCombinedTextureUnits}`)
	
		let maxTextureSize 		= gl.getParameter(gl.MAX_TEXTURE_SIZE)
		let maxCubemapSize 		= gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)
		let maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
		util.log(`max texture size: ${maxTextureSize}`)
		util.log(`max cubemap size: ${maxCubemapSize}`)
		util.log(`max render buffer size: ${maxRenderbufferSize}`)

		let maxVertexAttributes 			= gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
		let maxVertexShaderUniform4FLoats 	= gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
		let maxFragmentShaderUniform4FLoats = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)
		let maxVarying4FLoats 				= gl.getParameter(gl.MAX_VARYING_VECTORS)
		util.log(`max number of vertex attributes: ${maxVertexAttributes}`)
		util.log(`max vertex shader 4-float-component uniforms: ${maxVertexShaderUniform4FLoats}`)
		util.log(`max fragment shader 4-float-component uniforms: ${maxFragmentShaderUniform4FLoats}`)
		util.log(`max 4-float-component varyings: ${maxVarying4FLoats}`)

		let highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
		util.log(`high precision in shader supported: ${highp.precision != 0}`)


		// Note that the followings settings could be changed by materials,
		// thus materials need to restore these states when necessary.
		// (See Material.unbind())

		// set up depth test to discard occluded fragments
		gl.enable(gl.DEPTH_TEST)
		gl.depthFunc(gl.LESS)

		// only show front geometry
		gl.enable(gl.CULL_FACE)
		gl.cullFace(gl.BACK)
		gl.frontFace(gl.CCW)


		// in case a material isnt found, the renderer can set this material up
		this.errorMaterial = new ErrorMaterial(gl)

		// an exemplary render pass
		this.invertPass = new InvertPass(gl)

		// for multipass rendering, ignore if you are not interested
		let fboWidth = 800
		let fboHeight = 600
		this.fbos = {
			boundFboName: '',
			'color': new FrameBufferObject(gl, {
				width  : fboWidth,
				height : fboHeight,
				createDepthBuffer: true
			}),
		}
	}

	// Renders the given scene. Producing a final image could
	// involve multiple render passes. Add new render passes here
	// or edit existing ones for more features.
    render(scene) {
    	let gl = this.gl

		// get scene stuff
		let camera = scene.getActiveCamera()
		let lights = scene.getLights()
		let models = scene.getModels()
		let time   = scene.getTotalTime()

		// before starting render passes we could perform optimizations
		// here, for example frustum culling.

		// perform the current render pass type (single or multi pass)
		switch (this.passType) {

			// single render pass: render the scene normally
			default:
		    	this.setTargetFBO('') // render to screen
				gl.clearColor(0.1, 0.1, 0.1, 1.0);
				gl.clearDepth(1.0)  // this is the default
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
				this.defaultRenderPass(camera, lights, models, time)
				break

			// multi render pass: inverts the colors of the scene
			case 'invert':
			    // first pass
		    	this.setTargetFBO('color') // render to texture in the activated FBO
				gl.clearColor(0.1, 0.1, 0.3, 1.0)  // background color
				gl.clearDepth(1.0)  // this is the default
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // color FBO has depth attachment
				this.defaultRenderPass(camera, lights, models, time)	
				// second pass
				this.setTargetFBO('') 	// render to screen	
				this.invertRenderPass(this.fbos['color']['colorAttachment0']) // read rendered texture
				break
		}
    }

    // Binds the FBO to be rendered to. Setting no FBO will fall back
    // to the default FBO, which is the back buffer of WebGL.
    // With a bound FBO, the renderer will render into the FBO
    // (for later use of the image) and not directly to the screen.
    setTargetFBO(fboName) {
    	let gl = this.gl
    	
    	let fbo = this.fbos[fboName]
    	if (fbo) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.buffer)
			gl.viewport(0, 0, fbo.config.width, fbo.config.height)
		}
		else {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null)
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)		
		}
		this.fbos.boundFboName = fbo ? fboName : ''
    }

    // Performs a default renderpass. That is, the renderer produces an image with
    // the materials set on the models. Note that the pass is not optimized for simplicity.
    // For more performance, program switches and material state changes would be minimized,
    // which is known as "batching" (there is some optimization hidden in program.mjs).
    defaultRenderPass(camera, lights, models, time) {


        // process the models
        for (let name in models) {

        	// get the model stuff
            let model = models[name]
            let mesh      = model.mesh
            let material  = model.material
            let transform = model.worldTransform

        	// install the material's program in the pipeline
			material.use()

            // let the material configure its shaders
            // by providing all it needs
			switch (material.constructor.name) {
	            case 'VertexColorMaterial': material.bind(mesh, transform, camera); break
	            case 'TextureMaterial'    : material.bind(mesh, transform, camera); break
	            case 'GouraudMaterial'    : material.bind(mesh, transform, camera, lights['white']); break
				case 'GouraudTextureMaterial'    : material.bind(mesh, transform, camera, lights['white']); break
				case 'TextureBlendMaterial': material.bind(mesh, transform, camera); break
				case 'LightCubeMaterial': material.bind(mesh, transform, camera); break
				case 'PhongMaterial': material.bind(mesh, transform, camera, lights['white']); break
				case 'LightningMaterial': material.bind(mesh, transform, camera, lights['white']); break
				case 'LightCasterMaterial': material.bind(mesh, transform, camera, lights['pointLight']); break
	        	default: 
	        		// the bind case for the material of the current mesh is missing,
					// switch to the error material render path
					this.errorMaterial.use()
					this.errorMaterial.bind(mesh, transform, camera)
					mesh.draw()
					this.errorMaterial.unbind()
					continue
	        }

			// pipeline is set up, feed the mesh's buffers into it
	        mesh.draw()

	        // restore any state changes this material might have done
	        material.unbind()
        }
    }

    // Reads "texture" and inverts the colors. Results
    // are written to the current target FBO.
    invertRenderPass(texture) {
		this.invertPass.use()
		this.invertPass.bind(texture)
    	this.invertPass.draw()  
    }
}


export default Renderer
