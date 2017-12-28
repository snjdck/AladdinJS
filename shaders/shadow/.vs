#include <_Header>
#include <_QuadVertexList>
#include <quaternion>

out vec2 uv;
flat out mat4 matrix;

uniform mat4 screenMatrix1;
uniform vec4 cameraMatrix[2];
uniform mat4 screenMatrix2;

void main(){
	vec4 vertex = QuadVertexList[gl_VertexID];
	gl_Position = vec4(vertex.xy, 0, 1);
	uv = vertex.zw;
	matrix = screenMatrix2 * cast2mat(cameraMatrix[0], cameraMatrix[1]) * screenMatrix1;
}