#version 330

in vec2 fragTexCoord;
in vec4 fragColor;

uniform sampler2D texture0;
uniform vec4 colDiffuse;
uniform float time;

out vec4 finalColor;

void main()
{
    vec2 uv = fragTexCoord;
    uv.x += sin(uv.y*24.0 + time*3.0)*0.025;
    uv.y += cos(uv.x*18.0 + time*2.0)*0.015;
    finalColor = texture(texture0, uv)*colDiffuse*fragColor;
}
