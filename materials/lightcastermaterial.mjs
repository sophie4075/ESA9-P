import Material from "../engine/material.mjs";
import util from "../engine/util.mjs";

class LightCasterMaterial extends Material {

    constructor(gl, config = {}) {
        super(gl, config, 'pointlight');

        this.constant = config.constant || 1.0;
        this.linear = config.linear || 0.09;
        this.quadratic = config.quadratic || 0.032;


        this.diffuseMap = config.diffuseMap || null;
        this.specularMap = config.specularMap || null;


        this.shininess = config.shininess || 32.0;


        this.lightAmbient = config.lightAmbient || [0.2, 0.2, 0.2];
        this.lightDiffuse = config.lightDiffuse || [0.5, 0.5, 0.5];
        this.lightSpecular = config.lightSpecular || [1.0, 1.0, 1.0];


        this.lightPos = config.lightPos || [1.2, 1.0, 2.0];
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

        const lightPosLoc = this.program.getUniformLocation('lightPos');
        const viewPosLoc = this.program.getUniformLocation('viewPos');
        const lightAmbientLoc = this.program.getUniformLocation('lightAmbient');
        const lightDiffuseLoc = this.program.getUniformLocation('lightDiffuse');
        const lightSpecularLoc = this.program.getUniformLocation('lightSpecular');


        let lightPos = mesh.scene?.getLightCubePosition() ?? this.lightPos;
        const lightAmbient = light.ambient ? light.ambient : this.lightAmbient;
        const lightDiffuse = light.diffuse ? light.diffuse : this.lightDiffuse;
        const lightSpecular = light.specular ? light.specular : this.lightSpecular;

        this.gl.uniform3fv(lightPosLoc, new Float32Array(lightPos));
        this.gl.uniform3fv(viewPosLoc, new Float32Array(camera.getEye()));
        this.gl.uniform3fv(lightAmbientLoc, new Float32Array(lightAmbient));
        this.gl.uniform3fv(lightDiffuseLoc, new Float32Array(lightDiffuse));
        this.gl.uniform3fv(lightSpecularLoc, new Float32Array(lightSpecular));

        const shininessLoc = this.program.getUniformLocation('shininess');
        this.gl.uniform1f(shininessLoc, this.shininess);

        const constantLoc = this.program.getUniformLocation('constant');
        this.gl.uniform1f(constantLoc, this.constant);

        const linearLoc = this.program.getUniformLocation('linear');
        this.gl.uniform1f(linearLoc, this.linear);

        const quadraticLoc = this.program.getUniformLocation('quadratic');
        this.gl.uniform1f(quadraticLoc, this.quadratic);


        if (this.diffuseMap.glTexture) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.diffuseMap.glTexture);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

            const diffuseMapLoc = this.program.getUniformLocation('diffuseMap');
            this.gl.uniform1i(diffuseMapLoc, 0);
        }

        if (this.specularMap.glTexture) {
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.specularMap.glTexture);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

            const specularMapLoc = this.program.getUniformLocation('specularMap');
            this.gl.uniform1i(specularMapLoc, 1);
        }

        this.program.setAttribute('aPos', mesh.coordsBuffer);
        this.program.setAttribute('aNormal', mesh.normalsBuffer);
        this.program.setAttribute('aTexCoords', mesh.texcoordsBuffer);
    }

}

export default LightCasterMaterial