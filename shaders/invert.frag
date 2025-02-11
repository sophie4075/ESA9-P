uniform vec2 windowSize;
uniform sampler2D image;
uniform float curtain;

void main() {

	vec2 uv = vec2(gl_FragCoord.x / windowSize.x, gl_FragCoord.y / windowSize.y);
 
    vec4 pixel = texture2D(image, uv);

    if (uv.x > curtain)
        pixel = vec4(1.0, 1.0, 1.0, 1.0) - vec4(pixel.rgb, 0.0);

    gl_FragColor = pixel;

    // visualize window uv
    //gl_FragColor = vec4(gl_FragCoord.x / windowSize.x, gl_FragCoord.y / windowSize.y, 0, 1);
}