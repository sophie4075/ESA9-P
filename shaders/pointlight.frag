//Resource: Code is based on following tutorial https://learnopengl.com/Lighting/Light-casters
precision mediump float;

varying vec3 Normal;
varying vec3 FragPos;
varying vec2 TexCoords;

uniform vec3 lightPos;
uniform vec3 viewPos;
uniform vec3 lightAmbient;
uniform vec3 lightDiffuse;
uniform vec3 lightSpecular;

uniform sampler2D diffuseMap;
uniform sampler2D specularMap;
uniform float shininess;

// Attenuation
uniform float constant;
uniform float linear;
uniform float quadratic;

void main() {

    //ambient
    vec3 ambient = lightAmbient * texture2D(diffuseMap, TexCoords).rgb;

    //diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = lightDiffuse * diff * texture2D(diffuseMap, TexCoords).rgb;

    //specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = lightSpecular * spec * texture2D(specularMap, TexCoords).rgb;

    // attenuation
    float distance = length(lightPos - FragPos);
    float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));

    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);
}
