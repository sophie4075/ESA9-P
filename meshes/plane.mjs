
import Mesh from '../engine/mesh.mjs'
import util from '../engine/util.mjs'

let _coords = [
    -1, -1, 0,
     1, -1, 0,
     1,  1, 0,
    -1,  1, 0,
]

let _texcoords = [
    0, 0,
    1, 0,
    1, 1,
    0, 1,
]

let _normals = [
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
]

let _indices = [
    0, 1, 2,
    2, 3, 0,
]

let _mesh = null


class Plane {
    constructor(gl, config={}) {
        if (!_mesh)
            _mesh = new Mesh(gl, {
                coords    : _coords,
                texcoords : _texcoords,
                normals   : _normals,
                indices   : _indices,
                primitiveType: gl.TRIANGLES
            })

        this.mesh = _mesh
    }
}

       
export default Plane
