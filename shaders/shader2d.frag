#include <headers/HeaderFrag>
#include <headers/Varying>

uniform sampler2D sampler0;

out vec4 color;

void main(){
	//vec4 fgColor = colorList[InstanceID];
	color = texture(sampler0, uv);// * (1.0 - fgColor.a) + fgColor * fgColor.a;
}