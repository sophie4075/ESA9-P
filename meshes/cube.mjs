import Mesh from '../engine/mesh.mjs';

let _mesh = null;

class Cube {
    constructor(gl, config = {}) {
        if (!_mesh) {
            // 6 sides * 4 corner points
            const positions = [
                // Frontface
                -0.5, -0.5,  0.5,
                0.5, -0.5,  0.5,
                0.5,  0.5,  0.5,
                -0.5,  0.5,  0.5,

                // Backface
                0.5, -0.5, -0.5,
                -0.5, -0.5, -0.5,
                -0.5,  0.5, -0.5,
                0.5,  0.5, -0.5,

                // Left face
                -0.5, -0.5, -0.5,
                -0.5, -0.5,  0.5,
                -0.5,  0.5,  0.5,
                -0.5,  0.5, -0.5,

                // Right face
                0.5, -0.5,  0.5,
                0.5, -0.5, -0.5,
                0.5,  0.5, -0.5,
                0.5,  0.5,  0.5,

                // Top face
                -0.5,  0.5,  0.5,
                0.5,  0.5,  0.5,
                0.5,  0.5, -0.5,
                -0.5,  0.5, -0.5,

                // Bottom face
                -0.5, -0.5, -0.5,
                0.5, -0.5, -0.5,
                0.5, -0.5,  0.5,
                -0.5, -0.5,  0.5
            ];


            const normals = [
                // Frontface
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,

                // Backface
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,

                // Left face
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,

                // Right face
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,

                // Top face
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,

                // Bottom face
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
            ];

            // 4 cornerstones
            const texcoords = [
                // Frontface
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,

                // Backface
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,

                // Left face
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,

                // Right face
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,

                // Top face
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,

                // Bottom face
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
            ];

            //Indices for 2 triangles per face (total of 6 faces = 12 triangles)
            const indices = [
                0,  1,  2,   2,  3,  0,   // Frontface
                4,  5,  6,   6,  7,  4,   // Backface
                8,  9, 10,  10, 11,  8,   // Left face
                12, 13, 14,  14, 15, 12,   // Right face
                16, 17, 18,  18, 19, 16,   // Top face
                20, 21, 22,  22, 23, 20    // Bottom face
            ];

            _mesh = new Mesh(gl, {
                coords: positions,
                normals: normals,
                texcoords: texcoords,
                indices: indices,
                primitiveType: gl.TRIANGLES
            });
        }
        this.mesh = _mesh;
    }
}

export default Cube;



