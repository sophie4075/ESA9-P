
uniform mat4 modelViewprojectionMatrix;

attribute vec3 vertexPosition;


void main() {

	// project the vertex on screen with the MVP matrix:
	// v' = P * V * M * v
	// it is called MVP because the equation is read from right to left
	// 1. model matrix: place the vertex into the scene
	// 2. view matrix: how is the vertex seen from the camera
	// 3. projection matrix: where does the vertex lands on screen
	gl_Position = modelViewprojectionMatrix * vec4(vertexPosition, 1.0);
} 
 