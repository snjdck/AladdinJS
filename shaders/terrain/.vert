#include <headers/HeaderVert>
#include <headers/Varying>
#include <libs/quaternion>

#include <blocks/MVP_BLOCK>
/*
layout(location=auto)
in vec2 inputPosition;
*/
#define MAX_TILES (gl_MaxVertexUniformVectors - 8)

uniform int InstanceIDBase;
uniform float tileSize;
uniform vec2 tileList[MAX_TILES];

void main()
{
	vec2 vertex = vec2(gl_VertexID >> 1, gl_VertexID & 1);
	vec3 worldPosition  = vec3((vertex + tileList[gl_InstanceID]) * tileSize, 0);
	vec3 cameraPosition = transform2(cameraMatrix[0], cameraMatrix[1], worldPosition);
	vec4 screenPosition = screenMatrix * vec4(cameraPosition, 1);

	screenPosition.xy = screenPosition.xy * viewportXYWH.zw + viewportXYWH.xy;

	gl_Position = screenPosition;
	uv = vertex;
	//InstanceID = gl_InstanceID;
	//InstanceIndex = InstanceIDBase + gl_InstanceID;
}
