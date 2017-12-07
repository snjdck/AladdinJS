#version 300 es

precision highp float;
precision highp int;

layout(location=0)
in vec3 inputPosition;

layout(location=1)
in vec2 inputUV;

uniform mat4 screenMatrix;
uniform vec4 cameraMatrix[2];
uniform vec4 worldMatrix[2];

//uniform vec4 boneList[100];

out lowp vec2 uv;

#include <quaternion.glsl>

void main()
{
	vec3 worldPosition = transform2(worldMatrix, inputPosition);
	vec3 cameraPosition = transform2(cameraMatrix, worldPosition);
	vec4 screenPosition = screenMatrix * vec4(cameraPosition, 1);

	gl_Position = screenPosition;
	uv = inputUV;
}
