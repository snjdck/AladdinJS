#include <headers/HeaderFrag>
#include <headers/Varying>

uniform sampler2DArray sampler0;

flat in vec3 layer;
in vec4 light;

out vec4 color;

void main(){
	color = mix(
		texture(sampler0, vec3(uv, layer.x)),
		texture(sampler0, vec3(uv, layer.y)),
		layer.z
	) * light;
}