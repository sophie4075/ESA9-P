import Material from '../engine/material.mjs';
import util from '../engine/util.mjs';
import { mat4, vec3 } from '../lib/gl-matrix.mjs';

/*
 * Material for rendering the light cube.
 * The cube is only used to visualize the light position.
 */
class LightCubeMaterial extends Material {
    constructor(gl, config = {}) {
        super(gl, config, 'light_cube');

        this.config.color = config.color || [1.0, 1.0, 1.0];
    }


    bind(mesh, transform, camera) {
        if (!mesh.coordsBuffer) {
            return;
        }

        let projectionMatrix = camera.getProjection();
        let viewMatrix = camera.getView();
        let modelViewMatrix = mat4.create();

        mat4.multiply(viewMatrix, transform, modelViewMatrix);

        this.program.use();

        this.program.setUniform('projection', projectionMatrix);
        this.program.setUniform('view', viewMatrix);
        this.program.setUniform('model', transform);

        this.program.setAttribute('aPos', mesh.coordsBuffer);
    }
}

export default LightCubeMaterial;

