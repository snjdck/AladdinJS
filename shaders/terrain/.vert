#include <headers/HeaderVert>
#include <headers/Varying>
#include <libs/quaternion>
#include <blocks/MVP_BLOCK>

//uniform int InstanceIDBase;
uniform float tileSize;
uniform float uvScale;
uniform ivec2 vertexCount;

layout(location=auto)
in vec2 map_layer;//layer0, layer1

layout(location=auto)
in vec2 map_layermix_height;//mix, z-height

const float height_scale = 25.0;

layout(location=auto)
in vec4 map_light;

flat out vec3 layer;
out vec4 light;

void main()
{
	ivec2 vertex = ivec2(gl_VertexID % vertexCount.x, gl_VertexID / vertexCount.x);
	vec3 worldPosition  = vec3(vec2(vertex - (vertexCount >> 1)) * tileSize, map_layermix_height.y * height_scale);
	vec3 cameraPosition = transform2(cameraMatrix[0], cameraMatrix[1], worldPosition);
	vec4 screenPosition = screenMatrix * vec4(cameraPosition, 1);

	screenPosition.xy = screenPosition.xy * viewportXYWH.zw + viewportXYWH.xy;

	gl_Position = screenPosition;
	uv = vec2(vertex) * uvScale;
	layer = vec3(map_layer, map_layermix_height.x);
	light = map_light;
	//InstanceID = gl_InstanceID;
	//InstanceIndex = InstanceIDBase + gl_InstanceID;
}
