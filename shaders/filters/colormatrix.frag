#include <headers/Header>

uniform sampler2D sampler0;
uniform mat4 matrix;
uniform vec4 offset;

in vec2 uv;
out vec4 color;

void main(){
	color = matrix * texture(sampler0, uv) + offset;
}