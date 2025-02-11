import util from '../engine/util.mjs'

/*
 * A little canvas controller. Needs focus on the canvas for key presses.
 */
class Input {

	constructor(gl, config) {
		this.config = config
		this.canvas = gl.canvas
		this.paused = false
		this.mouse = {
			pos : [NaN, NaN],
			dxy : [0, 0],
			down: false
		}
		this.listen()
	}

	listen() {
		let canvas = this.canvas

		// register mouse actions over the canvas
		canvas.addEventListener('mousedown', (event) => {
			this.mouse.down = true
			event.stopPropagation()
		})

		canvas.addEventListener('mouseup', (event) => {
			this.mouse.down = false
			event.stopPropagation()
		})

		canvas.addEventListener('mousemove', (event) => {
			let newpos = this.contextPos(event)
			this.mouse.dxy[0] = newpos[0] - this.mouse.pos[0]
			this.mouse.dxy[1] = newpos[1] - this.mouse.pos[1]
			this.mouse.pos = newpos
			event.stopPropagation()
		})

		canvas.addEventListener('click', (event) => {
			// activate that keypresses are associated with the canvas
			canvas.setAttribute('tabindex','0')
			canvas.focus()
			event.stopPropagation()
		})

		canvas.addEventListener('keypress', (event) => {
			switch (event.code) {
				case 'KeyP': this.paused =! this.paused; break
			}
			event.stopPropagation()
		})

		// option: render normally
		let normal = util.byid('normal')
		normal.addEventListener('click', (event) => {
			if (normal.checked)
				this.config.renderer.passType = ''
			event.stopPropagation()
		})

		// option: render inverted
		let invert = util.byid('invert')
		invert.addEventListener('click', (event) => {
			if (invert.checked)
				this.config.renderer.passType = 'invert'
			event.stopPropagation()
		})
		let curtain = util.byid('curtain')
		curtain.addEventListener('input', (event) => {
			this.config.renderer.invertPass.curtain = parseFloat(event.target.value)
		})
	}

	contextPos(event) {
		// calculate the coordinates relative to the upper left corner
		let rect = this.canvas.getBoundingClientRect();
		return [
			event.clientX - rect.left,
			event.clientY - rect.top
		]
	}

	update() {
	    this.mouse.dxy[0] = 0
        this.mouse.dxy[1] = 0	
	}
}

export default Input
