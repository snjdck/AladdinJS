#version 300 es

precision highp float;
precision highp int;

uniform sampler2D sampler0;

in vec2 uv;
flat in int InstanceID;
out vec4 color;

void main(){
	ivec4 t = InstanceID / ivec4(1, 256, 65536, 16777216);
	t.xyz -= t.yzw * 256;
	color = vec4(t) / 255.0;
}