uniform sampler2D texture;

varying vec2 texcoords;


void main() {

	gl_FragColor = texture2D(texture, texcoords.xy);
} 
