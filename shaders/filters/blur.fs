#include <_Header>
#include <_FragmentIn>

uniform sampler2D sampler0;
uniform vec2 offset[2];
uniform vec3 weight;

out vec4 color;

void main(){
	vec4 rgba = texture(sampler0, uv) * weight[2];
	for(int i=0; i<2; ++i){
		rgba += texture(sampler0, uv - offset[i]) * weight[i];
		rgba += texture(sampler0, uv + offset[i]) * weight[i];
	}
	color = rgba;
}