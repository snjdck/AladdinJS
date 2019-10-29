#include <headers/HeaderFrag>
#include <headers/Varying>

#ifndef IGNORE_ALPHA_FLAG
uniform sampler2D sampler0;
#endif

out vec4 color;

void main(){

#ifndef IGNORE_ALPHA_FLAG
	if(texture(sampler0, uv).a < 0.1)discard;
#endif

	ivec4 t = InstanceIndex / ivec4(1, 256, 65536, 16777216);
	t.xyz -= t.yzw * 256;
	color = vec4(t) / 255.0;
}