#include <headers/Header>

uniform sampler2D sampler1;
uniform sampler2DShadow sampler0;

flat in mat4 matrix;
in vec2 uv;

out vec4 color;

void main(){
	float z = texture(sampler1, uv).r;
	if(z >= 1.0){
		color = vec4(1);
		return;
	}
	vec4 position = vec4(uv, z, 1);
	position = matrix * position;
	float alpha = texture(sampler0, position.xyz) * 0.4 + 0.6;
	color = vec4(alpha, alpha, alpha, 1);
}