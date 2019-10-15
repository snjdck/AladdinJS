#include <headers/Header>
#include <libs/quaternion>

out vec2 uv;
flat out mat4 matrix;

uniform _ {
	mat4 screenMatrix1;
	vec4 cameraMatrix[4];
	mat4 screenMatrix2;
	vec4 viewportXYWH;
};

const float bias = 0.005;
const mat4 tex2clip = mat4(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, -1, -1, -1, 1);
const mat4 clip2tex = mat4(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5 * (1.0 - bias), 1);

void main(){
	vec2 vertex = vec2(gl_VertexID >> 1, gl_VertexID & 1);
	gl_Position = vec4(vertex * vec2(2) - vec2(1), 0, 1);
	uv = vertex;
	mat4 cameraMatrix1 = cast2mat(cameraMatrix[0], cameraMatrix[1]);
	mat4 cameraMatrix2 = cast2mat(cameraMatrix[2], cameraMatrix[3]);
	vec2 wh = 1.0 / viewportXYWH.zw;
	vec2 xy = wh * -viewportXYWH.xy;
	mat4 viewportMat = mat4(wh.x, 0, 0, 0, 0, wh.y, 0, 0, 0, 0, 1, 0, xy.x, xy.y, 0, 1);
	matrix = clip2tex * screenMatrix2 * cameraMatrix2 * cameraMatrix1 * inverse(screenMatrix1) * viewportMat * tex2clip;
}