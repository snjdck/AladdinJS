#include <headers/Header>
#include <headers/FragmentIn>

uniform sampler2D sampler0;
uniform int radius;
uniform vec2  offset[11];
uniform float weight[11];

out vec4 color;

void main(){
	vec4 rgba = texture(sampler0, uv) * weight[0];
	for(int i=1; i<radius; ++i){
		rgba += texture(sampler0, uv - offset[i]) * weight[i];
		rgba += texture(sampler0, uv + offset[i]) * weight[i];
	}
	color = rgba;
}