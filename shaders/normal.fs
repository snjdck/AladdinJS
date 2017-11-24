#version 300 es

precision highp float;
precision highp int;

uniform sampler2D sampler0;

in vec2 uv;
out vec4 color;

void main(){
	color = texture(sampler0, uv);
}