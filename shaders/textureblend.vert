uniform mat4 mvpMatrix;

attribute vec3 vertexPosition;
attribute vec2 vertexTexcoords;

varying vec2 texcoords;

void main() {
    texcoords = vertexTexcoords;
    gl_Position = mvpMatrix * vec4(vertexPosition, 1.0);
}