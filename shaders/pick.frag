#include <headers/Header>
#include <headers/FragmentIn>

uniform sampler2D sampler0;

out vec4 color;

void main(){
	if(texture(sampler0, uv).a < 0.1)
		discard;
	ivec4 t = InstanceIndex / ivec4(1, 256, 65536, 16777216);
	t.xyz -= t.yzw * 256;
	color = vec4(t) / 255.0;
}