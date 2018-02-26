#include <headers/Header>
#include <headers/VertexOut>
#include <libs/quaternion>

layout(location=0)
in vec3 inputPosition;

layout(location=1)
in vec2 inputUV;

layout(location=2)
in ivec4 boneIndex;//multipy 2 already

layout(location=3)
in vec4 boneWeight;

#define MAX_BONES ((gl_MaxVertexUniformVectors - 7) >> 1) << 1

uniform _ {
	mat4 screenMatrix;
	vec4 cameraMatrix[2];
	int InstanceIDBase;
	int bindCount;
	int boneCount;//multipy 2 already
	vec4 boneList[MAX_BONES];
};

void main()
{
	vec3 worldPosition = vec3(0);
	for(int i=0; i<bindCount; ++i){
		int index = boneIndex[i] + boneCount * gl_InstanceID;
		worldPosition += transform2(boneList[index], boneList[index+1], inputPosition) * boneWeight[i];
	}
	Position = worldPosition;
	vec3 cameraPosition = transform2(cameraMatrix[0], cameraMatrix[1], worldPosition);
	vec4 screenPosition = screenMatrix * vec4(cameraPosition, 1);

	gl_Position = screenPosition;
	uv = inputUV;
	InstanceID = gl_InstanceID;
	InstanceIndex = InstanceIDBase + gl_InstanceID;
}
