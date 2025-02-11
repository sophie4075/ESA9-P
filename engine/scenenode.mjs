import util from './util.mjs'
import { mat4 } from '../lib/gl-matrix.mjs'

/*
 * Simple Scene node with transforms, a parent and children.
 * Can have additional actions to be performed. 
 */
class SceneNode {
	constructor(gl, config={}) {
		this.gl = gl
		this.name = config.name || 'anon node'
		this.localTransform = mat4.create(config.transform || mat4.identity())
		this.worldTransform = mat4.create(config.transform || mat4.identity())
		this.parent = null
		this.children = []
		this.actions = []
	}

	// Checks if this node is in the subtree of the given node.
	isAncestor(parent) {
		if (!(parent instanceof SceneNode)) {
			util.fatal(`"${parent}" is not a scene node.`)
			return
		}

		let node = this
		while (node && node !== parent) {
			node = node.parent
		}
		return !!node
	}

	// Adds a node as a child to this node if possible. Beware of weird relation changes.
	addChild(child) {
		if (this.isAncestor(child)) {
			util.crit(`"${child.name}" is ancestor of scene node ${this.name}. Can't be added as child.`)
			return
		}

		if (child.parent) {
			let index = child.parent.children.indexOf(child)
			if (index !== -1)
				child.parent.children.splice(index, 1)
		}

		child.parent = this
		this.children.push(child)
	}

	// Add a custom update function (an action) to the node.
	addAction(func) {
		if (!util.isFunction(func))
			util.fatal(`Action "${func.name}" for scene node "${this.name}" is not a function.`)

		this.actions.push(func)
	}

	// Remove all custom update functions.
	clearActions() {
		this.actions = []
	}

	// Update the node. This is a recursive call, all childs will be updated too.
	update(deltaTime, totalTime) {
		// update the world transform first before doing
		// any actions or processing children
		mat4.multiply(
			this.parent ? this.parent.worldTransform : mat4.identity(),
			this.localTransform,
			this.worldTransform
		)

		// call the user defined actions of this node
		// we take care that the actions can access this node
		for (let action of this.actions)
			action.call(this, deltaTime, totalTime)

		// update all children
		for (let child of this.children)
			child.update(deltaTime, totalTime)
	}
}


export default SceneNode
