import SceneNode from '../engine/scenenode.mjs'
import Camera from '../engine/camera.mjs'
import Light from '../engine/light.mjs'
import Model from '../engine/model.mjs'
import Textures from '../engine/textureloader.mjs'

import Gizmo from '../meshes/gizmo.mjs'
import Plane from '../meshes/plane.mjs'
import Sphere from '../meshes/sphere.mjs'
import Cube from "../meshes/cube.mjs";

import ErrorMaterial from '../materials/errormaterial.mjs'
import VertexColorMaterial from '../materials/vertexcolormaterial.mjs'
import TextureMaterial from '../materials/texturematerial.mjs'
import GouraudMaterial from '../materials/gouraudmaterial.mjs'

import {mat4} from '../lib/gl-matrix.mjs'
import TextureBlendMaterial from "../materials/textureblendmaterial.mjs";
import GouraudTextureMaterial from "../materials/gouraudtexturematerial.mjs";
import LightCubeMaterial from "../materials/lightcubematerial.mjs";
import PhongMaterial from "../materials/phongmaterial.mjs";
import LightingMaterial from "../materials/lightingMaterial.mjs";
import LightCasterMaterial from "../materials/lightcastermaterial.mjs";



/*
 * Class containing all elements in a 3d scene. If the scene graph pattern is used,
 * the scene will automatically update all nodes.
 * Cameras, lights, models etc. are organized in dictionaries only for convenience.
 * This is no enforced pattern, edit as you like.
 */
class Scene {

    constructor(gl, config) {
        this.gl = gl

        // world time of this scene
        this.totalTime = 0

        // we need at least one camera
        this.cameras = {
            'main': new Camera(gl, {
                transform: mat4.translate(mat4.identity(), [1,2,4]),
                projectionType: 'perspective',
                //projectionType: 'orthographic',
                //orthoScale: 2
            })
        }
        // if there are multiple cameras, we may need to know
        this.activeCamera = this.cameras['main']

        // some material instances
        this.materials = {
            'error': new ErrorMaterial(gl),
            'vertexcolor': new VertexColorMaterial(gl),
            'webgl': new TextureMaterial(gl, {
                texture: Textures.getTexture('webgllogo')
            }),
            'moon': new GouraudTextureMaterial(gl, {
                ambient   : [0.1,0.1,0.1],
                diffuse   : [1,1,1],
                specular  : [1,1,1],
                shininess : 0,
                texture: Textures.getTexture('moon')
            }),
            'white': new GouraudMaterial(gl, {
                ambient   : [0.1,0.1,0.1],
                diffuse   : [1,1,1],
                specular  : [1,1,1],
                shininess : 4
            }),
            'blend': new TextureBlendMaterial(gl, {
                textureA: Textures.getTexture('textureA'),
                textureB: Textures.getTexture('textureB'),
                textureBlend: Textures.getTexture('textureBlend')
            }),
            'sun': new GouraudTextureMaterial(gl, {
                ambient   : [1,1,1],
                diffuse   : [0,0,0],
                specular  : [0,0,0],
                shininess : 0,
                texture: Textures.getTexture('sun')
            }),
            'earth': new GouraudTextureMaterial(gl, {
                ambient   : [0.1,0.1,0.1],
                diffuse   : [1,1,1],
                specular  : [1,1,1],
                shininess : 20,
                texture: Textures.getTexture('earth')
            }),
            'light_cube' : new LightCubeMaterial(gl),
            'phong': new PhongMaterial(gl, {
                color: [1.0, 0.5, 0.31],
                lightColor: [1.0, 1.0, 1.0],
            }),
            'phong_texture': new LightingMaterial(gl, {
                diffuseMap: Textures.getTexture('diffiuseMap'),
                specularMap: Textures.getTexture('specularMap'),
                shininess: 64.0
            }),
            'point_light' : new LightCasterMaterial(gl, {
                diffuseMap: Textures.getTexture('diffiuseMap'),
                specularMap: Textures.getTexture('specularMap'),
                shininess: 32.0,
                constant: 1.0,
                linear: 0.09,
                quadratic: 0.032
            })
        }

        // some lights
        this.lights = {
            'white': new Light(gl, {
                transform: mat4.translate(mat4.identity(), [0,1,1]),
                color    : [1,1,1]
            }),
            'sun': new Light(gl, {
                transform: mat4.translate(mat4.identity(), [0,100,0]),
                color    : [1,0.8,0.2]
            }),
            'mainLight': new Light(gl, {
                transform: mat4.translate(mat4.identity(), [0, 3, 3]),
                color: [1, 1, 1]
            }),
            'pointLight' : new Light(gl, {
                transform: mat4.translate(mat4.identity(), [1, 2, 3]),
                color: [1, 1, 1]
            })
        }



        // meshes used for models
        this.gizmo    = new Gizmo(gl)
        this.plane    = new Plane(gl)
        this.sphereLo = new Sphere(gl, { numLatitudes: 10, numLongitudes: 10 })
        this.sphereHi = new Sphere(gl, { numLatitudes: 50, numLongitudes: 50 })
        this.cube = new Cube(gl)


        // models in the scene
        this.models = {

            'light_cube' : new Model(gl, {
                name: 'light_cube',
                mesh: this.cube.mesh,
                material: this.materials['light_cube'],
                transform: mat4.translate(mat4.identity(), [3, 0, -2])

            }),

    }


        const numCubes = 10;
        const minDistance = 1.5;

        for (let i = 0; i < numCubes; i++) {
            let validPosition = false;
            let x, y, z, distance;

            while (!validPosition) {
                let angle = (i / numCubes) * Math.PI * 2;
                let distanceFromCenter = 2 + Math.random() * 8;
                x = Math.cos(angle) * distanceFromCenter;
                z = Math.sin(angle) * distanceFromCenter;
                y = Math.random() * 2 - 1;

                let lightCubePos = this.getLightCubePosition();
                distance = Math.sqrt(
                    Math.pow(x - lightCubePos[0], 2) +
                    Math.pow(y - lightCubePos[1], 2) +
                    Math.pow(z - lightCubePos[2], 2)
                );

                if (distance > minDistance) {
                    validPosition = true;
                }
            }

            let rotation = mat4.rotateY(mat4.identity(), Math.random() * Math.PI * 2);

            this.models[`point_light_cube_${i}`] = new Model(gl, {
                name: `point_light_cube_${i}`,
                mesh: this.cube.mesh,
                material: this.materials['point_light'],
                transform: mat4.multiply(mat4.translate(mat4.identity(), [x, y, z]), rotation)
            });

        }



        Object.values(this.models).forEach(model => {
            model.scene = this;
            if (model.mesh) {
                // Mesh is supposed to know scene so a mesh can be set as a light a source
                model.mesh.scene = this;
            }
        });



        // scenegraph's root
        this.worldRoot = new SceneNode(gl, { name: 'scene root' });

        this.worldRoot.addChild(this.cameras['main']);
        this.worldRoot.addChild(this.models['light_cube'])

        for(let i = 0; i < numCubes; i++){
            this.worldRoot.addChild(this.models[`point_light_cube_${i}`])
        }


    }

    // Called by the main loop, updates the scene graph by integrating the time.
    // If you have scene elements which are not in the scene graph, you need to
    // update these yourself.
    update(deltaTime) {



        this.totalTime += deltaTime;

        // Rotational movement for the light (orbit around the origin)
        let t = this.totalTime * 0.5; // Movement speed
        let radius = 5;
        let x = Math.cos(t) * radius;
        let z = Math.sin(t) * radius;
        let y = 1.5 + Math.sin(t * 0.5) * 0.5;


        let minDistance = 1.5;
        let avoidanceForce = [0, 0, 0];

        Object.values(this.models).forEach(model => {
            let modelPos = model.localTransform.slice(12, 15);
            let distance = Math.sqrt(
                Math.pow(x - modelPos[0], 2) +
                Math.pow(y - modelPos[1], 2) +
                Math.pow(z - modelPos[2], 2)
            );

            if (distance < minDistance) {
                let force = (minDistance - distance) * 0.5;
                avoidanceForce[0] += (x - modelPos[0]) * force;
                avoidanceForce[1] += (y - modelPos[1]) * force;
                avoidanceForce[2] += (z - modelPos[2]) * force;
            }
        });


        x += avoidanceForce[0];
        y += avoidanceForce[1];
        z += avoidanceForce[2];


        this.models['light_cube'].localTransform = mat4.translate(mat4.identity(), [x, y, z]);

        this.worldRoot.update(deltaTime, this.totalTime)
    }

    getActiveCamera() { return this.activeCamera }
    getCameras() { return this.cameras }
    getLights() { return this.lights }
    getModels() { return this.models }
    getTotalTime() { return this.totalTime }

    getLightCubePosition() {
        return this.models['light_cube']?.localTransform?.slice(12, 15) ?? [1.2, 1.0, 2.0];
    }


}


export default Scene

