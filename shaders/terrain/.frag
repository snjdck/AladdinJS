#include <headers/HeaderFrag>
#include <headers/Varying>

uniform sampler2D sampler0;

out vec4 color;

void main(){
	color = texture(sampler0, uv);
}