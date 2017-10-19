#version 300 es

precision highp float;
precision highp int;

in lowp vec2 uv;

uniform sampler2D sampler0;

out vec4 color;

void main(){
	color = texture(sampler0, uv);
}