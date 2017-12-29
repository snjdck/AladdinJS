#include <_Header>
#include <_VertexOut>
#include <quaternion>

layout(location=0)
in vec2 inputPosition;

#define MAX_TILES (gl_MaxVertexUniformVectors - 7)

uniform _ {
	mat4 screenMatrix;
	vec4 cameraMatrix[2];
	int InstanceIDBase;
	float tileSize;
	vec2 tileList[MAX_TILES];
};

void main()
{
	vec3 worldPosition  = vec3((inputPosition + tileList[gl_InstanceID]) * tileSize, 0);
	vec3 cameraPosition = transform2(cameraMatrix[0], cameraMatrix[1], worldPosition);
	vec4 screenPosition = screenMatrix * vec4(cameraPosition, 1);

	gl_Position = screenPosition;
	uv = inputPosition * 0.5 + 0.5;
	InstanceID = gl_InstanceID;
	InstanceIndex = InstanceIDBase + gl_InstanceID;
}
