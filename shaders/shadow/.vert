#include <headers/Header>
#include <headers/QuadVertexList>
#include <libs/quaternion>

out vec2 uv;
flat out mat4 matrix;

uniform _ {
	mat4 screenMatrix1;
	vec4 cameraMatrix[4];
	mat4 screenMatrix2;
};

const float bias = 0.005;
const mat4 tex2clip = mat4(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, -1, -1, -1, 1);
const mat4 clip2tex = mat4(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5 * (1.0 - bias), 1);

void main(){
	vec4 vertex = QuadVertexList[gl_VertexID];
	gl_Position = vec4(vertex.xy, 0, 1);
	uv = vertex.zw;
	mat4 cameraMatrix1 = cast2mat(cameraMatrix[0], cameraMatrix[1]);
	mat4 cameraMatrix2 = cast2mat(cameraMatrix[2], cameraMatrix[3]);
	matrix = clip2tex * screenMatrix2 * cameraMatrix2 * cameraMatrix1 * inverse(screenMatrix1) * tex2clip;
}