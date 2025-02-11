
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

struct Light {
	vec4 position;  // expected in eye coordinates (ec)
	vec3 color;
};
uniform Light light;

struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};
uniform Material material;

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;

varying vec3 color;


vec3 gouraud(vec3 p, vec3 v, vec3 n, vec3 lp, vec3 lc) {

	// AUFGABE E3: implement phong model
	vec3 ambient = material.ambient * lc;

	vec3 light = normalize(lp - p);
	float diffuseFactor = max(dot(n, light), 0.0);
	vec3 diffuse = material.diffuse * lc * diffuseFactor;

	vec3 reflection = reflect(-light, n);
	float specularFactor = pow(max(dot(v, reflection), 0.0), material.shininess);
	vec3 specular = material.specular * lc * specularFactor;

	// Sum all components
	return ambient + diffuse + specular;


	//return material.ambient;
}

void main() {

	vec3 ecPosition = (modelViewMatrix * vec4(vertexPosition, 1.0)).xyz;
	vec3 ecNormal   = normalize(normalMatrix * vertexNormal);

	bool useOrtho = projectionMatrix[2][3] == 0.0;
	vec3 ecViewDir = useOrtho ? vec3(0.0, 0.0, 1.0) : normalize(-ecPosition);

	// for the lighting calculations to work correctly,
	// all input vectors need to be in the same space
	color = gouraud(ecPosition, ecViewDir, ecNormal, light.position.xyz, light.color);
	
	gl_Position = projectionMatrix * vec4(ecPosition, 1.0);
}
