#include <headers/HeaderFrag>
#include <headers/Varying>

uniform sampler2D sampler0;
flat in vec4 fgColor;

out vec4 color;

void main(){
	color = texture(sampler0, uv) * (1.0 - fgColor.a) + fgColor * fgColor.a;
}