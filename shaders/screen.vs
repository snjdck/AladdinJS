#version 300 es

precision highp float;
precision highp int;

layout(location=0)
in vec2 inputPosition;

out vec2 uv;

void main()
{
	gl_Position = vec4(inputPosition, 0, 1);
	uv = inputPosition * vec2(0.5, -0.5) + vec2(0.5, 0.5);
}