precision mediump float;

varying vec3 vLightingColor;
varying vec2 vTexCoords;

uniform sampler2D uTexture;

void main() {

	vec4 texColor = texture2D(uTexture, vTexCoords);
	gl_FragColor = vec4(vLightingColor, 1.0) * texColor;
}
