import Material from '../engine/material.mjs';
import util from '../engine/util.mjs';
import { mat4 } from '../lib/gl-matrix.mjs';

class PhongMaterial extends Material {
    constructor(gl, config = {}) {
        super(gl, config, 'phong');

        this.config.color = config.color || [1.0, 0.5, 0.31];
        this.config.lightColor = config.lightColor || [1.0, 1.0, 1.0];
        this.config.lightPos = config.lightPos || [1.2, 1.0, 2.0];
    }

    bind(mesh, transform, camera, light) {

        if (!mesh.coordsBuffer || !mesh.normalsBuffer) {
            return;
        }

        let projectionMatrix = camera.getProjection();
        let viewMatrix = camera.getView();

        let projectionLoc = this.program.getUniformLocation('projection');
        let viewLoc = this.program.getUniformLocation('view');
        let modelLoc = this.program.getUniformLocation('model');

        this.program.use();

        this.gl.uniformMatrix4fv(projectionLoc, false, projectionMatrix);
        this.gl.uniformMatrix4fv(viewLoc, false, viewMatrix);
        this.gl.uniformMatrix4fv(modelLoc, false, transform);

        let objectColorLoc = this.program.getUniformLocation('objectColor');
        let lightColorLoc = this.program.getUniformLocation('lightColor');
        let lightPosLoc = this.program.getUniformLocation('lightPos');
        let viewPosLoc = this.program.getUniformLocation('viewPos');

        this.gl.uniform3fv(objectColorLoc, this.config.color);
        this.gl.uniform3fv(lightColorLoc, this.config.lightColor);

        let lightPos = mesh.scene?.getLightCubePosition() ?? this.config.lightPos
        this.gl.uniform3fv(lightPosLoc, lightPos);
        this.gl.uniform3fv(viewPosLoc, new Float32Array(camera.getEye()));

        this.program.setAttribute('aPos', mesh.coordsBuffer);
        this.program.setAttribute('aNormal', mesh.normalsBuffer);
    }
}

export default PhongMaterial;
