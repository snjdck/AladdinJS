#include <_Header>
#include <quaternion>

uniform sampler2D sampler0;
uniform lowp sampler2DShadow sampler1;

in vec2 uv;
out vec4 color;

uniform mat4 screenMatrix1;
uniform vec4 cameraMatrix[2];
uniform mat4 screenMatrix2;

const float bias = 0.005;

void main(){
	float z = texture(sampler0, uv).r;
	if(z >= 1.0){
		color = vec4(1);
		return;
	}
	vec4 position = vec4(uv, z, 1);
	position = position * 2.0 - 1.0;
	position = screenMatrix1 * position;
	position.xyz = transform2(cameraMatrix[0], cameraMatrix[1], position.xyz);
	position = screenMatrix2 * position;
	vec3 uvt = vec3(position.xy * 0.5 + 0.5, (position.z - bias) * 0.5 + 0.5);
	float alpha = texture(sampler1, uvt) * 0.5 + 0.5;
	color = vec4(alpha, alpha, alpha, 1);
}