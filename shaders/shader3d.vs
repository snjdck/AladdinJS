#version 300 es

precision highp float;
precision highp int;

layout(location=0)
in vec3 inputPosition;

layout(location=1)
in vec3 inputUV;

uniform mat4 screenMatrix;
uniform vec4 cameraMatrix[2];
uniform vec4 worldMatrix[2];
uniform vec4 boneList[100];

out lowp vec2 uv;

#include <quaternion.glsl>

void main()
{
	int boneIndex = int(inputUV.z) * 2;
	vec3 worldPosition = transform2(boneList[boneIndex], boneList[boneIndex+1], inputPosition);
	vec3 cameraPosition = transform2(cameraMatrix[0], cameraMatrix[1], worldPosition);
	vec4 screenPosition = screenMatrix * vec4(cameraPosition, 1);

	gl_Position = screenPosition;
	uv = inputUV.xy;
}
