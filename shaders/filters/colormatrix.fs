#include <_Header>
#include <_FragmentIn>

uniform sampler2D sampler0;
uniform mat4 matrix;
uniform vec4 offset;

out vec4 color;

void main(){
	color = matrix * texture(sampler0, uv) + offset;
}