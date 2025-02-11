//Resource: https://learnopengl.com/Lighting/Lighting-maps
precision mediump float;

varying vec3 Normal;
varying vec3 FragPos;
varying vec2 TexCoords;

uniform vec3 lightPos;
uniform vec3 viewPos;
uniform vec3 lightAmbient;
uniform vec3 lightDiffuse;
uniform vec3 lightSpecular;
uniform vec3 objectColor;

uniform sampler2D diffuseMap;
uniform sampler2D specularMap;
uniform float shininess;

void main() {
    // Ambient lighting

    vec3 ambient = lightAmbient * texture2D(diffuseMap, TexCoords).rgb;

    // Diffuse lighting
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = lightDiffuse * diff * texture2D(diffuseMap, TexCoords).rgb;

    // Specular lighting
    float specularStrength = 0.5;
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = lightSpecular * specularStrength * spec * texture2D(specularMap, TexCoords).rgb;

    // Final color calculation
    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);

}
