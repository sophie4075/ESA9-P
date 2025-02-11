
import Mesh from '../engine/mesh.mjs'
import util from '../engine/util.mjs'

// the origin and the three unit axes
let _coords = [
    0, 0, 0,
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]

// xyz axis colored in rgb
let _colors = [
    1, 1, 1, 1,
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1
]

// three lines from the origin
let _indices = [
    0, 1,
    0, 2,
    0, 3
]

// singleton
let _mesh = null

// simple wrapper for mesh construction
class Gizmo {

    constructor(gl, config={}) {
        // setup the mesh singleton when gl is available
        if (!_mesh)
            _mesh = new Mesh(gl, {
                coords  : _coords,
                colors  : _colors,
                indices : _indices,
                primitiveType : gl.LINES
            })

        this.mesh = _mesh
    }
}

       
export default Gizmo
