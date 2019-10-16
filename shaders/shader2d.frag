#include <headers/HeaderFrag>
#include <headers/Varying>

uniform sampler2D sampler0;

uniform Color_2D_BLOCK {
	vec4 colorList[MAX_2D_OBJECTS];
};

out vec4 color;

void main(){
	vec4 fgColor = colorList[InstanceID];
	color = texture(sampler0, uv) * (1.0 - fgColor.a) + fgColor * fgColor.a;
}