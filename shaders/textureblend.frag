uniform sampler2D textureA;
uniform sampler2D textureB;
uniform sampler2D textureBlend;

varying vec2 texcoords;

void main() {
    vec4 color1 = texture2D(textureA, texcoords);
    vec4 color2 = texture2D(textureB, texcoords);
    float blendFactor = texture2D(textureBlend, texcoords).r;

    gl_FragColor = mix(color1, color2, blendFactor);
}