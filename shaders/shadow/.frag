#include <_Header>

uniform sampler2D sampler0;
uniform sampler2DShadow sampler1;

flat in mat4 matrix;
in vec2 uv;

out vec4 color;

void main(){
	float z = texture(sampler0, uv).r;
	if(z >= 1.0){
		color = vec4(1);
		return;
	}
	vec4 position = vec4(uv, z, 1);
	position = matrix * position;
	float alpha = texture(sampler1, position.xyz) * 0.4 + 0.6;
	color = vec4(alpha, alpha, alpha, 1);
}