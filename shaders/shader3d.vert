#include <headers/HeaderVert>
#include <headers/Varying>
#include <libs/quaternion>
#include <blocks/MVP_BLOCK>

layout(location=auto)
in vec3 inputPosition;

layout(location=auto)
in vec3 inputNormal;

layout(location=auto)
in vec2 inputUV;

layout(location=auto)
in ivec4 boneIndex;

layout(location=auto)
in vec4 boneWeight;

layout(location=auto)
in ivec2 boneInfo;//[bindCount, boneCount]

#define MAX_BONES 1024

uniform int InstanceIDBase;
uniform vec4 boneList[MAX_BONES];

void main()
{
	vec3 worldPosition = vec3(0);
	for(int i=0; i<boneInfo.x; ++i){
		int index = (boneIndex[i] + boneInfo.y * gl_InstanceID) << 1;//every bone use two registers
		worldPosition += transform2(boneList[index], boneList[index+1], inputPosition) * boneWeight[i];
	}
	Position = worldPosition;
	vec3 cameraPosition = transform2(cameraMatrix[0], cameraMatrix[1], worldPosition);
	vec4 screenPosition = screenMatrix * vec4(cameraPosition, 1);

	screenPosition.xy = screenPosition.xy * viewportXYWH.zw + viewportXYWH.xy;

	gl_Position = screenPosition;
	uv = inputUV;
#ifdef PICKING_MODE_FLAG
	InstanceID = gl_InstanceID;
	InstanceIndex = InstanceIDBase + gl_InstanceID;
#endif
}
